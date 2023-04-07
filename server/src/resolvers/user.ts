import { MyContext } from '../types';
import { User } from '../entities/User';
import {
    Arg,
    Ctx,
    Int,
    Query,
    Mutation,
    Resolver,
    Field,
    InputType,
    ObjectType,
} from 'type-graphql';
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
        if (!req.session.userid) {
            return null;
        }

        const user = await em.findOne(User, { id: req.session.userid });

        return user;
    }

    @Query(() => [User])
    users(@Ctx() { em }: MyContext): Promise<User[]> {
        return em.find(User, {});
    }

    @Query(() => User, { nullable: true })
    user(
        @Arg('id', () => Int) id: number,
        @Ctx() { em }: MyContext
    ): Promise<User | null> {
        return em.findOne(User, { id });
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });

        if (!user) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'User does not exist.',
                    },
                ],
            };
        }

        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message:
                            'Username and password combination is incorrect.',
                    },
                ],
            };
        }

        req.session.userid = user.id;
        return {
            user,
        };
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'Username must be longer than 2 characters.',
                    },
                ],
            };
        }

        if (options.password.length <= 7) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'Password must be longer than 7 characters.',
                    },
                ],
            };
        }

        const hashedPassword = await argon2.hash(options.password);

        const user = em.create(User, {
            username: options.username,
            password: hashedPassword,
        });

        try {
            await em.persistAndFlush(user);
        } catch (err) {
            console.error(err);
            if (err.code === '23505') {
                // Duplicate username
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'This user already exists!',
                        },
                    ],
                };
            }

            return {
                errors: [
                    {
                        field: 'unknown',
                        message: 'An unknown error occurred.',
                    },
                ],
            };
        }

        req.session.userid = user.id;
        return {
            user,
        };
    }

    @Mutation(() => User, { nullable: true })
    async updateUser(
        @Arg('id') id: number,
        @Arg('username') username: string,
        @Ctx() { em }: MyContext
    ): Promise<User | null> {
        const user = await em.findOne(User, { id });
        if (!user) {
            return null;
        }

        if (typeof username !== 'undefined') {
            user.username = username;
            await em.persistAndFlush(user);
        }

        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<Boolean> {
        const user = await em.findOne(User, { id });

        if (!user) {
            return false;
        }

        try {
            await em.removeAndFlush(user);
        } catch {
            return false;
        }

        return true;
    }
}

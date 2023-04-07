import { __PROD__ } from './constants';

import 'reflect-metadata';

import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';

import express from 'express';
import session from 'express-session';

import { ApolloServer } from 'apollo-server-express';

import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

import { createClient } from 'redis';
import RedisStore from 'connect-redis';

import cors from 'cors';

declare module 'express-session' {
    export interface SessionData {
        userid: number;
    }
}

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();

    const app = express();

    let redisClient = createClient();
    redisClient.connect().catch(console.error);

    let redisStore = new RedisStore({
        client: redisClient,
        prefix: 'cleppit:',
        disableTouch: true,
    });

    const whitelist = [
        'http://localhost:3000', 
        'https://studio.apollographql.com'
    ];
    app.use(
        cors({
            origin: function (origin, callback) {
                if (!__PROD__) {
                    return callback(null, true);
                }

                if (!(!!origin)) {
                    console.log(origin);
                    console.log(!!origin);
                    callback(new Error('Origin server is not specified.'));
                } else if (whitelist.indexOf(origin) === -1) {
                    callback(new Error('Origin is not whitelisted for CORS.'));
                }

                callback(null, true);
            },
            credentials: true,
        })
    );

    app.use(
        session({
            secret: 'geaspomhkaeo5ruyj-[sj',

            name: 'qid',
            store: redisStore,

            cookie: {
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
                httpOnly: true,
                sameSite: 'lax', // CSRF
                secure: __PROD__,
            },

            resave: false,
            saveUninitialized: false,
        })
    );

    const apollo = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res }),
    });

    await apollo.start();
    apollo.applyMiddleware({ app, cors: false });

    app.listen(4000, () => {
        console.log('Server started on localhost:4000');
    });
};

main();

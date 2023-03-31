import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __PROD__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";


const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();
    
    const app = express();
    const apollo = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em }),
    })

    await apollo.start();
    apollo.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("Server started on localhost:4000");
    })
}

main();
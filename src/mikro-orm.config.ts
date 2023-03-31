import path from "path";
import { __PROD__ } from "./constants";
import { Post } from "./entities/Post";

import { MikroORM } from "@mikro-orm/core";

export default {
    debug: !__PROD__,
    allowGlobalContext: true,

    type: 'postgresql',
    user: 'postgres',
    password: 'root',

    dbName: 'cleppit',

    entities: [Post],

    migrations: {
        path: path.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}', 
    }
} as Parameters<typeof MikroORM.init>[0];
import { knex } from 'knex';

export interface User {
    uuid: string;
    email: string;
    username: string;
    password: string;
};

const config = {
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOSTNAME,
        port: 5432,
        user: process.env.POSTGRES_USER,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD
    }
}

const authDb = knex(config);

export default authDb;

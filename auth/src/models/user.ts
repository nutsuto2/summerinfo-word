import { Client } from 'pg';

const userDb = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOSTNAME,
    port: 5432,
    database: process.env.POSTGRES_DB
});

export default userDb;

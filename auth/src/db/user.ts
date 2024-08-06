// import { newDb } from 'pg-mem'

// const userDb = newDb();

// export default userDb;

import pg, { Client } from 'pg';

const userDb = new Client({
    user: 'auth_user',
    password: '192ca54baf44ad83d0071a19feedac2d',
    host: 'postgres://auth-postgres-srv:5432/auth',
    port: 5432,
    database: 'auth_db'
});

export default userDb;

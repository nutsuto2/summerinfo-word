import { knex } from 'knex';
import { config } from './db-config';

export interface User {
    uuid: string;
    email: string;
    username: string;
    password: string;
};

export default knex(config);

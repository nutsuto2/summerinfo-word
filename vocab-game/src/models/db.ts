import { knex } from 'knex';
import { config } from './db-config';

export interface Vocabulary {
    vocabulary: string;
    firstAlphabet: string;
    isUsed: boolean;
}

export default knex(config);

import { newDb } from 'pg-mem'

const userDb = newDb();

export default userDb;
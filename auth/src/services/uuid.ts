import crypto from 'crypto';
import userDb from "../models/user";
import { QueryArrayResult } from 'pg';

export const generateUUID = async () => {
    let uuid: string;
    let existingUUID: QueryArrayResult<any[]>;
    do {
        uuid = crypto.randomUUID();
        existingUUID = await userDb.query({
            text: 'SELECT * FROM "user" WHERE uuid = $1;',
            values: [uuid],
            rowMode: 'array'
        });
    } while (existingUUID.rowCount !== 0)
    
    return uuid;
}
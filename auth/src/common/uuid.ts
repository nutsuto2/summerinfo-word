import crypto from 'crypto';
import userDb from "../db/user";

export const generateUUID = () => {
    let uuid: string;
    let existingUUID: any[];
    do {
        uuid = crypto.randomUUID();
        existingUUID =  userDb.public.many(`
            SELECT *
            FROM "user"
            WHERE "user"."uuid" = '${uuid}'
            `);
    } while (existingUUID.length !== 0)
    
    return uuid;
}
import crypto from 'crypto';
import authDb from "../models/db";

export const generateUUID = async () => {
    let uuid: string;
    let existingUUID;
    do {
        uuid = crypto.randomUUID();
        existingUUID = await authDb('users').where({
            uuid: uuid
        });
    } while (existingUUID.length !== 0)
    
    return uuid;
}

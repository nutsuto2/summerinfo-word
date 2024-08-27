import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { usedVocabAttrs } from '../types/interfaces';

interface UsedVocabPayload {
    usedVocabularies: Array<usedVocabAttrs>;
}

declare global {
    namespace Express {
        interface Request {
            usedVocab?: Array<usedVocabAttrs>
        }
    }
}

export const UsedVocab = async (req: Request, res: Response, next: NextFunction) => {
    // check if there is jwt cookie or not
    if (!req.session?.usedVocab) {
        return next();
    }

    // get usedVocabularies from jwt
    try {
        const payload = jwt.verify(
            req.session.usedVocab,
            process.env.JWT_KEY!
        ) as UsedVocabPayload;

        req.usedVocab = payload.usedVocabularies;
    } catch (err) {
        console.log('UsedVocab', 'Catch statement', !req.session!.usedVocab);
        throw new Error(JSON.stringify(err));
    }

    next();
}

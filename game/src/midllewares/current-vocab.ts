import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface currentVocabPayload {
    vocabulary: string
}

// add property to request interface
declare global {
    namespace Express {
        interface Request {
            currentVocab?: string
        }
    }
}

export const currentVocab = async (req: Request, res: Response, next: NextFunction) => {
    // check if there is jwt cookie or not
    if (!req.session?.currentVocab) {
        return next();
    }

    // get currentWord from jwt
    try {
        const payload = jwt.verify(
            req.session.currentVocab,
            process.env.JWT_KEY!
        ) as currentVocabPayload;

        req.currentVocab = payload.vocabulary;
    } catch (err) {
        throw new Error();
    }

    next();
}

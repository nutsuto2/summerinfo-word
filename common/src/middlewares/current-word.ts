import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// add property currentWord to the payload
interface WordPayload {
    word: string;
}

// add property to request interface
declare global {
    namespace Express {
        interface Request {
            currentWord?: WordPayload
        }
    }
}

export const currentWord = async (req: Request, res: Response, next: NextFunction) => {
    // check if there is jwt cookie or not
    if (!req.session?.word) {
        return next();
    }

    // get currentWord from jwt
    try {
        const payload = jwt.verify(
            req.session.word,
            process.env.JWT_KEY!
        ) as WordPayload

        req.currentWord = payload;
    } catch (err) {
        throw new Error();
    }

    next();
}

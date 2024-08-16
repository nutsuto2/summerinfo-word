import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
    if (!req.session?.word) {
        return next();
    }

    // get currentWord from jwt
    try {
        const payload = jwt.verify(
            req.session.word,
            process.env.JWT_KEY!
        ) as string;

        req.currentVocab = payload;
    } catch (err) {
        throw new Error();
    }

    next();
}

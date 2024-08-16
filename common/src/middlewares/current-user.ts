import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// add property currentUser to Request
interface UserPayload {
    email: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
    // check if there is jwt cookie or not
    // if (!req.session?.jwt) {
    //     return next();
    // }
    if (!req.session?.userJwt) {
        return next();
    }

    // need to get username from jwt
    // try {
    //     const payload = jwt.verify(
    //         req.session.jwt,
    //         process.env.JWT_KEY!
    //     ) as UserPayload;

    //     req.currentUser = payload;
    // } catch (err) {
    //     throw new Error();
    //  }
     try {
        const payload = jwt.verify(
            req.session.userJwt,
            process.env.JWT_KEY!
        ) as UserPayload;

        req.currentUser = payload;
    } catch (err) {
        throw new Error();
     }

    next();
}
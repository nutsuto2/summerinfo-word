import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthenticatedError } from '../errors/not-authenticated-error';

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

export const authAndUser = async (req: Request, res: Response, next: NextFunction) => {
    // check if there is jwt cookie or not
    if (!req.session?.user) {
        throw new NotAuthenticatedError();
    }

    // get username from jwt cookie
     try {
        const payload = jwt.verify(
            req.session.user,
            process.env.JWT_KEY!
        ) as UserPayload;

        req.currentUser = payload;
    } catch (err) {
        throw new Error();
     }

    next();
}

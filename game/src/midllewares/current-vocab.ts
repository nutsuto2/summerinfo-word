import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { NotAuthenticatedError } from '@summerinfo/common';
import { GameError, gameErrors } from '../errors/game-error';

// add property to request interface
declare global {
    namespace Express {
        interface Request {
            currentVocab?: string
        }
    }
}

export const currentVocab = async (req: Request, res: Response, next: NextFunction) => {
    // check if the user is signed-in or not
    if (!req.currentUser) {
        throw new NotAuthenticatedError();
    }

    const user = await User.findOne({ username: req.currentUser.username });
    if (!user) {
        next();
    }

    // get currentWord from user
    try {
        const payload = user!.currentVocabulary;

        req.currentVocab = payload;
    } catch (err) {
        throw new GameError(500, gameErrors.USER_NOT_FOUND);
    }

    next();
}

import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { usedVocabAttrs } from '../types/interfaces';
import { NotAuthenticatedError } from '@summerinfo/common';
import { GameError, gameErrors } from '../errors/game-error';

declare global {
    namespace Express {
        interface Request {
            usedVocab?: Array<usedVocabAttrs>
        }
    }
}

export const UsedVocab = async (req: Request, res: Response, next: NextFunction) => {
    // check if the user is signed-in or not
    if (!req.currentUser) {
        throw new NotAuthenticatedError();
    }

    const user = await User.findOne({ username: req.currentUser.username });
    if (!user) {
        next();
    }

    // get usedVocabularies from user
    try {
        const payload = user!.usedVocabularies;

        req.usedVocab = payload;
    } catch (err) {
        throw new GameError(500, gameErrors.USER_DATA_NOT_FOUND);
    }

    next();
}

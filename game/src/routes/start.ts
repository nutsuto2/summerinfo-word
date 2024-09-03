import express, { Request, Response } from 'express';
import 'express-async-errors';
import { Game } from '../utils/game';
import { playerType } from '../types/interfaces';
import { authAndUser } from '@summerinfo/common';
import { User } from '../models/user';
import { userTimers, UserTimer } from '../utils/timer';
import { GameError, gameErrors } from '../errors/game-error';

const router = express.Router();

router.get('/api/game/start', authAndUser, async (req: Request, res: Response) => {
    // find first vocabulary
    const firstVocabulary = await Game.findFirstVocabulary();

    // check if user is already played or not
    const username = req.currentUser!.username;
    const user = await User.findOne({ username: username });
    if (!user) {
        const newUser = User.build({
            username: username,
            currentVocabulary: firstVocabulary,
            usedVocabularies: [{
                vocabulary: firstVocabulary,
                usedBy: playerType.CPU
            }],
            isFinished: false
        });
        await newUser.save();
    } else if (user.isFinished) {
        throw new GameError(400, gameErrors.ALREADY_FINISHED);
    }

    if (!userTimers.has(username)) {
        // Create a new UserTimer instance for new users
        userTimers.set(username, new UserTimer(username));
    } else {
        // TODO: add mechanism to deal with when user refresh page
        // console.log(`Timer is already existed for ${username}`);
    }

    res.status(200).send({ firstVocabulary: firstVocabulary });
});

export { router as startRouter }

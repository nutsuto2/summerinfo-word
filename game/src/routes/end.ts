import express, { Request, Response } from 'express';
import 'express-async-errors';
import { authAndUser } from '@summerinfo/common';
import { UsedVocab } from '../midllewares/used-vocab';
import { Game } from '../utils/game';
import { calculateRewards } from '../utils/reward';
import { User } from '../models/user';
import { GameError, gameErrors } from '../errors/game-error';

const router = express.Router();

router.get('/api/game/end', authAndUser, UsedVocab, async (req: Request, res: Response) => {
    if (!req.usedVocab) {
        throw new Error('No used vocabularies');
    }
    
    // calculate rewards
    const usedVocab = req.usedVocab;
    const numberofPlay = await Game.getNumberofPlay(usedVocab);
    const rewards = calculateRewards(usedVocab, numberofPlay);
    const isCleared = true ? numberofPlay == 5 : false;

    // update user isFinished
    const user = await User.findOne({ username: req.currentUser!.username });
    if (!user) {
        throw new GameError(500, gameErrors.USER_NOT_FOUND);
    }
    await user.updateOne({
        isFinished: true
    });

    // TODO: publish game end event

    res.status(200).send({ isCleared, rewards });
});

export { router as endRouter };

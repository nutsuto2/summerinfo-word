import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Game } from '../utils/game';
import { currentVocab } from '../midllewares/current-vocab';
import { UsedVocab } from '../midllewares/used-vocab';
import { validateRequest } from '@summerinfo/common';
import { playerType } from '../types/interfaces';
import { VocabDoc, Vocabulary } from '../models/vocabulary';
import { authAndUser } from '@summerinfo/common';
import { userTimers } from '../utils/timer';
import { User } from '../models/user';
import { GameError, gameErrors } from '../errors/game-error';

const router = express.Router();

router.post('/api/game/play',
    [
        body('connectingVocabulary')
            .isString()
            .isLength({ min: 5, max: 5 })
            .toLowerCase()
            .notEmpty()
    ],
    validateRequest,
    authAndUser, currentVocab, UsedVocab,
    async (req: Request, res: Response) => {
        // get connecting vocabulary
        const { connectingVocabulary } = req.body;

        // check if there is user data or not
        const username = req.currentUser!.username;
        const user = await User.findOne({ username: username });
        if (!user) {
            throw new GameError(400, gameErrors.NOT_START);
        }
        if (user.isFinished) {
            throw new GameError(400, gameErrors.ALREADY_FINISHED);
        }
        const currentVocabulary = user.currentVocabulary;
        const usedVocabularies = user.usedVocabularies.map((attrs) => attrs.vocabulary);

        // check if connectingVocabulary is in database or not
        const vocabulary = await Vocabulary.findOne({ vocabulary: connectingVocabulary });
        if (!vocabulary) {
            throw new GameError(400, gameErrors.VOCAB_NOT_FOUND);
        }

        // check if use duplicated vocabulary or not
        const isDuplicated = await Game.duplicationCheck(connectingVocabulary, usedVocabularies);

        if (isDuplicated) {
            throw new GameError(400, gameErrors.ALREADY_USED)
        }

        // compare connecting vocabulary with current vocabulary
        const isUseable = await Game.compareVocabulary(connectingVocabulary, currentVocabulary);

        // check if timer object existed
        if (!userTimers.has(username)) {
            throw new GameError(500, gameErrors.NO_TIMER);
        }
        const timer = userTimers.get(username);

        let newVocabulary: VocabDoc;
        if (isUseable) {
            // check if the game is completed or not
            const numberofPlay = await Game.getNumberofPlay(user.usedVocabularies);
            if (numberofPlay == 5) {
                timer!.onTimeout();
                userTimers.delete(username);
                return res.status(200).send('The game is completed');
            }

            // find new vocabulary
            usedVocabularies.push(connectingVocabulary);
            newVocabulary = await Game.findVocabulary(connectingVocabulary, usedVocabularies);

            // add vocab to usedVocab
            const updatedUsedVocabularies = user.usedVocabularies;
            updatedUsedVocabularies.push({
                vocabulary: connectingVocabulary,
                usedBy: playerType.PLAYER
            });
            updatedUsedVocabularies.push({
                vocabulary: newVocabulary.vocabulary,
                usedBy: playerType.CPU
            });

            // update user data
            await user.updateOne({
                currentVocabulary: newVocabulary.vocabulary,
                usedVocabularies: updatedUsedVocabularies
            });

            // reset timer
            timer!.resetTimer(false);
            // console.log('reset timer when user play');

        } else {

            // reduce timer
            timer!.resetTimer(true);
            // console.log('reduce timer when user failed to play');

            throw new GameError(400, gameErrors.UN_USEABLE);
        }

        res.status(200).send({ connectingVocabulary: connectingVocabulary, isUseable, currentVocabulary: newVocabulary.vocabulary });
    });

export { router as playRouter };

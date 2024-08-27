import express, { Request, Response } from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import { Game } from '../utils/game';
import { currentVocab } from '../midllewares/current-vocab';
import { UsedVocab } from '../midllewares/used-vocab';
import { BadRequestError, validateRequest } from '@summerinfo/common';
import jwt from 'jsonwebtoken';
import { playerType } from '../types/interfaces';
import { Vocabulary } from '../models/vocabulary';
import { authAndUser } from '@summerinfo/common';

const router = express.Router();

// TODO: add isAuthenticated when it's finished
router.post('/api/game/play', authAndUser,
    [
        body('connectingVocabulary')
            .isString()
            .isLength({ min: 5, max: 5 })
            .toLowerCase()
            .notEmpty()
    ],
    validateRequest,
    currentVocab, UsedVocab,
    async (req: Request, res: Response) => {
        // get connecting vocabulary
        const { connectingVocabulary } = req.body;

        if (!req.currentVocab) {
            throw new BadRequestError('No current vocabulary');
        }

        if (!req.usedVocab) {
            throw new BadRequestError('No used vocabularies');
        }

        const usedVocabularies: string[] = [];
        req.usedVocab.forEach((attrs) => {
            usedVocabularies.push(attrs.vocabulary);
        });

        // check if use duplicated vocabulary or not
        const isDuplicated = await Game.duplicationCheck(connectingVocabulary, usedVocabularies);

        if (isDuplicated) {
            throw new BadRequestError('Can not use used vocaulary');
        }

        // compare connecting vocabulary with current vocabulary
        const isUseable = await Game.compareVocabulary(connectingVocabulary, req.currentVocab);

        if (isUseable) {
            // add vocab to usedVocab
            const updatedUsedVocabularies = req.usedVocab;
            updatedUsedVocabularies.push({
                vocabulary: connectingVocabulary,
                usedBy: playerType.PLAYER
            });
            const usedVocabJwt = jwt.sign({
                usedVocabularies: updatedUsedVocabularies
            },
                process.env.JWT_KEY!
            );
            req.session!.usedVocab = usedVocabJwt;

            // find new vocabulary
            usedVocabularies.push(connectingVocabulary);
            const newVocabulary = Game.findVocabulary(connectingVocabulary, usedVocabularies);
            const vocabJwt = jwt.sign({
                vocabulary: newVocabulary
            },
                process.env.JWT_KEY!
            );
            req.session!.currentVocab = vocabJwt;

            // update isUsed
            await Vocabulary.findOneAndUpdate({
                vocabulary: connectingVocabulary
            },

                {
                    $set: {
                        isUsed: true
                    }
                });
        } else {
            throw new BadRequestError('Vocabulary can not be used to connect');
        }

        // TODO: reset timer

        // TODO: publis event

        res.status(200).send({ currentVocabulary: connectingVocabulary });
    });

export { router as playRouter };

import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { compareVocabulary } from '../services/vocabulary';
import { currentVocab } from '../midllewares/current-vocab';
import { validateRequest } from '@summerinfo/common';

const router = express.Router();

// TODO: add isAuthenticated when it's finished
router.post('/api/games/player', body('connectingVocabulary')
    .isString()
    .isLength({ min: 5, max: 5 })
    .notEmpty(),
    validateRequest, currentVocab, async (req: Request, res: Response) => {
        // get connecting vocabulary
        const { connectingVocabulary } = req.body;

        if (!req.currentVocab) {
            throw new Error('No current vocabulary');
        }

        // compare connecting vocabulary with current vocabulary
        const isUseable = await compareVocabulary(connectingVocabulary, req.currentVocab);

        // TODO: add logic to reward user

        // TODO: reset timer

    });

export { router as playerRouter };

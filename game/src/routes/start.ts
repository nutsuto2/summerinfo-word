import express, { Request, Response } from 'express';
import 'express-async-errors';
import { Game } from '../utils/game';
import jwt from 'jsonwebtoken';
import { playerType, usedVocabAttrs } from '../types/interfaces';
import { authAndUser } from '@summerinfo/common';

const router = express.Router();

router.get('/api/game/start', authAndUser, async (req: Request, res: Response) => {
    // find first vocabulary
    const firstVocabulary = await Game.findFirstVocabulary();

    // assign currentVocab to cookie session
    const vocabJwt = jwt.sign({
        vocabulary: firstVocabulary
    },
        process.env.JWT_KEY!
    );
    req.session!.currentVocab = vocabJwt;

    const usedVocabularies: Array<usedVocabAttrs> = [{
        vocabulary: firstVocabulary,
        usedBy: playerType.CPU
    }]
    const usedVocabJwt = jwt.sign({
        usedVocabularies
    },
        process.env.JWT_KEY!
    );
    req.session!.usedVocab = usedVocabJwt;

    // TODO: add timer countdown

    // TODO: publish event

    res.status(200).send({ firstVocabulary: firstVocabulary });
});

export { router as startRouter }

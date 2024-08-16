import express, { Request, Response } from 'express';
import { findFirstVocabulary } from '../services/vocabulary';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/games/start', async (req: Request, res: Response) => {
    // find first vocabulary
    const firstVocabulary = await findFirstVocabulary();

    // assign currentVocab to cookie session
    const vocabJwt = jwt.sign({
        firstVocabulary
    },
        process.env.JWT_KEY!
    );

    req.session!.currentVocab = vocabJwt;

    // TODO: add timer countdown

    res.status(200).send({ firstVocabulary: firstVocabulary });
});

export { router as startRouter }

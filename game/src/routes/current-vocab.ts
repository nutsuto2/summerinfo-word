import express, { Request, Response } from 'express';
import { authAndUser } from '@summerinfo/common';
import { currentVocab } from '../midllewares/current-vocab';

const router = express.Router();

router.get('/api/game/current-vocabulary', authAndUser, currentVocab, async (req: Request, res: Response) => {
    const currentVocab = req.currentVocab;
    res.send({ currentVocabulary: currentVocab });
});

export { router as currentVocabularyRouter }; 

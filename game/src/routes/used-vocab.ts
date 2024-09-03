import express, { Request, Response } from 'express';
import { authAndUser } from '@summerinfo/common';
import { UsedVocab } from '../midllewares/used-vocab';

const router = express.Router();

router.get('/api/game/used-vocabularies', authAndUser, UsedVocab, (req: Request, res: Response) => {
    const usedVocab = req.usedVocab;
    res.send({ usedVocabularies: usedVocab });
});

export { router as usedVocabulariesRouter }

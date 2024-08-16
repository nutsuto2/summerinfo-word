import express from 'express';
import { currentWord } from '@summerinfo/common';

const router = express.Router();

router.post('/api/games/player', currentWord, async () => {
    
});

export { router as playerRouter };

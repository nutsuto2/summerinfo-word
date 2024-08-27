import express, { Request, Response } from 'express';
import 'express-async-errors';
import { authAndUser } from '@summerinfo/common';

const router = express.Router();

router.get('/api/game/end', async (req: Request, res: Response) => {
    // calculate rewards
});

export { router as endRouter };

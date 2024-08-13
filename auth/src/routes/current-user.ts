import express, { Request, Response } from 'express';
import { currentUser } from '@summerinfo/common';

const router = express.Router();

router.get('/api/users/current-user', currentUser, (req: Request, res: Response) => {
    const currentUser = req.currentUser || null;
    res.send({ currentUser: currentUser  });
});

export { router as currentUserRouter }

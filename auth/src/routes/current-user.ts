import express, { Request, Response } from 'express';
import { authAndUser } from '@summerinfo/common';

const router = express.Router();

router.get('/api/users/current-user', authAndUser, (req: Request, res: Response) => {
    const currentUser = req.currentUser;
    res.send({ currentUser: currentUser  });
});

export { router as currentUserRouter }

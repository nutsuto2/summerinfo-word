import express, { Request, Response } from 'express';
import { authAndUser } from '@summerinfo/common';

const router = express.Router();

router.post('/api/users/signout', authAndUser, async (req: Request, res: Response) => {
    // remove jwt
    req.session = null;

    res.send({});
});

export { router as signoutRouter }

import express, { Request, Response } from 'express';
import { currentUser } from '@summerinfo/common';

const router = express.Router();

router.post('/api/users/signout', currentUser, async (req: Request, res: Response) => {
    // remove jwt
    req.session = null;

    res.send({});
});

export { router as signoutRouter }

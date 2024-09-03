import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Password } from '../utils/password';
import { validateRequest, AuthenticationError } from '@summerinfo/common';

const router = express.Router();

router.post('/api/users/signin', [
    body('username')
        .notEmpty()
        .isString()
        .isLength({ min: 6 })
        .withMessage('must be at least 6 characters long'),
    body('password')
        .notEmpty()
        .isString()
], validateRequest, async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
        throw new AuthenticationError();
    }

    // compare password with stored password
    const passwordsMatch = await Password.comparePassword(password, existingUser.password);
    if (!passwordsMatch) {
        throw new AuthenticationError();
    }

    // assign jwt to cookie session
    const userJwt = jwt.sign({
        email: existingUser.email,
        username: username
    },
        process.env.JWT_KEY!
    );

    req.session!.user = userJwt;

    res.status(200).send(JSON.stringify({
        email: existingUser.email,
        username: username
    }));
});

export { router as signinRouter };

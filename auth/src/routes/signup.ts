import express, { Request, Response } from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@summerinfo/common';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .notEmpty()
        .isEmail(),
    body('username')
        .notEmpty()
        .isString()
        .isLength({ min: 6 })
        .withMessage('must be at least 6 characters long'),
    body('password')
        .notEmpty()
        .isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
        .withMessage('must be at least 8 characters long, contains at least 1 uppercase character, contains at least 1 number, and contains at least 1 symbol character')
], validateRequest, async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    // check if email and username is already exist or not
    const existingUser = await User.findOne({ email, username });

    if (existingUser) {
        throw new BadRequestError('Email or password is in use');
    }

    // insert user data too db 
    const user = User.build({
        email, username, password
    });
    await user.save();

    // assign jwt to cookie session
    const userJwt = jwt.sign(
        {
            email: email,
            username: username
        },
        process.env.JWT_KEY!
    );

    req.session!.user = userJwt;

    res.status(201).send(JSON.stringify({
        email, username
    }));
});

export { router as signupRouter };

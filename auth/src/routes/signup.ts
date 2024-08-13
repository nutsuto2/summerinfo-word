import express, { Request, Response } from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import authDb from '../models/db';
import { generateUUID } from '../services/uuid';
import { hashingPassword } from '../services/password';
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
    const existingUser = await authDb('users').where({
        email: email,
        username: username
    });
    if (existingUser.length != 0) {
        throw new BadRequestError('Email or Username is already used');
    }

    // generate uuid for user record
    const uuid = await generateUUID();

    // hash password
    const storedPassword = await hashingPassword(password);

    // insert user data too db 
    await authDb('users').insert({
        uuid: uuid,
        email: email,
        username: username,
        password: storedPassword
    });

    // assign jwt to cookie session
    const userJwt = jwt.sign(
        {
            email: email,
            username: username
        },
        process.env.JWT_KEY!
    );

    req.session = {
        jwt: userJwt
    };

    res.status(201).send(JSON.stringify({
        email, username
    }));
});

export { router as signupRouter };

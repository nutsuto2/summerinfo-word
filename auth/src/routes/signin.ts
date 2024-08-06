import express, { Request, Response } from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import userDb from '../models/user';
import { comparePassword } from '../services/password';
import { validateRequest, NotFoundError } from '@summerinfo/common';

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

    const existingUser = await userDb.query({
        text: `SELECT "email", "user", "password" FROM "user" WHERE "username" = $1;`,
        values: [username],
        rowMode: 'array'
    });
    if (existingUser.rowCount === 0) {
        throw new NotFoundError('Username or Password is incorrect');
    }

    // compare password with stored password
    const storedPassword = existingUser.rows[0][2];
    const match = await comparePassword(password, storedPassword)
    if (!match) {
        throw new NotFoundError('Username or Password is incorrect');
    }

    // assign jwt to cookie session
    const userJwt = jwt.sign({
        emial: existingUser.rows[0][0],
        username: username
    },
        process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    res.status(200).send(JSON.stringify({
        email: existingUser.rows[0][0],
        username: username
    }));
});

export { router as signinRouter };

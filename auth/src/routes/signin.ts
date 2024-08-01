import express, { Request, Response } from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import userDb from '../db/user';
import { comparePassword } from '../common/password';
import { validateRequest } from '../../../common/src/middlewares/validate-request';
import { NotFoundError } from '../../../common/src/errors/not-found-error';

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

    // check if username existed in db or not
    const existingUser = userDb.public.many(`
        SELECT *
        FROM "user"
        WHERE "user"."username" = '${username}';
        `);
    if (existingUser.length === 0) {
        throw new NotFoundError('Username or Password is incorrect');
    }

    // compare password with stored password
    const storedPassword = existingUser[0].password;
    const match = await comparePassword(password, storedPassword)
    if (!match) {
        throw new NotFoundError('Username or Password is incorrect');
    }

    // assign jwt to cookie session
    const userJwt = jwt.sign({
        emial: existingUser[0].email,
        username: username
    },
        process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    res.status(200).send(JSON.stringify({
        email: existingUser[0].email,
        username: username
    }));
});

export { router as signinRouter };

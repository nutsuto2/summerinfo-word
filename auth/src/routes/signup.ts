import express, { Request, Response } from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import userDb from '../db/user';
import { hashingPassword } from '../common/password';
import { validateRequest } from '../../../common/src/middlewares/validate-request';
import { BadRequestError } from '../../../common/src/errors/bad-request-error';

const router = express.Router();

router.post('/api/auth/signup', [
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
    const existingUser = userDb.public.many(`
            SELECT *
            FROM "user"
            WHERE "email" = '${email}' OR "username" = '${username}';
            `);
    if (existingUser.length > 0) {
        throw new BadRequestError('Email or Username is already used');
    }

    // hash password
    const storedPassword = await hashingPassword(password);

    // insert user data too db 
    userDb.public.many(`
            INSERT INTO "user" ("email", "username", "password") VALUES ('${email}', '${username}', '${storedPassword}') RETURNING "id";
        `)

    res.status(201).send(JSON.stringify({
        email, username
    }));
});

export { router as SignUpRouter };

import express, { Request, Response } from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import userDb from '../db/user';
import { generateUUID } from '../common/uuid';
import { hashingPassword } from '../common/password';
import { validateRequest } from '../../../common/src/middlewares/validate-request';
import { BadRequestError } from '../../../common/src/errors/bad-request-error';

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
    const existingUser = userDb.public.many(`
            SELECT *
            FROM "user"
            WHERE "user"."email" = '${email}' OR "user"."username" = '${username}';
            `);
    if (existingUser.length > 0) {
        throw new BadRequestError('Email or Username is already used');
    }

    // generate uuid for user record
    const uuid = generateUUID();
    
    // hash password
    const storedPassword = await hashingPassword(password);

    // insert user data too db 
    userDb.public.one(`
            INSERT INTO "user" ("uuid", "email", "username", "password") VALUES ('${uuid}', '${email}', '${username}', '${storedPassword}') RETURNING "uuid";
        `);

    // assign jwt to cookie session
    const userJwt = jwt.sign(
        {
            email: email,
            username: username
        },
        process.env.JWT_KEY!
    );

    req.session = {
        jwt : userJwt
    };

    res.status(201).send(JSON.stringify({
        email, username
    }));
});

export { router as signupRouter };

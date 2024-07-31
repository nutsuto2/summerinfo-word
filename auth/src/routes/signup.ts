import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import userDb from '../db/user';
import { hashingPassword } from '../common/password';

const router = express.Router();

router.post('/api/auth/signup', [
    body('email')
        .notEmpty()
        .isEmail(),
    body('username')
        .notEmpty()
        .isString(),
    body('password')
        .notEmpty()
        .isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
],
    async (req: Request, res: Response) => {
        const { email, username, password } = req.body;

        // check if email and username is already exist or not
        const existingUser = userDb.public.many(`
            SELECT *
            FROM "user"
            WHERE "email" = '${email}' OR "username" = '${username}';
            `);
        if (existingUser.length > 0) {
            console.error('Email or Username is already existed');
        }

        // hash password
        const storedPassword = await hashingPassword(password);

        // insert user data too db 
        userDb.public.many(`
            INSERT INTO "user" ("email", "username", "password") VALUES ('${email}', '${username}', '${storedPassword}') RETURNING "id";
        `)

        const user = {
            email, username
        };
        res.send(JSON.stringify(user));
});

export { router as SignUpRouter };
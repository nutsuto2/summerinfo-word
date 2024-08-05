import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler } from '@summerinfo/common';

import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { currentUserRouter } from './routes/current-user';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    secure: false,
    signed: false
}));

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(currentUserRouter);

app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError('Not found');
});

app.use(errorHandler);

export { app };

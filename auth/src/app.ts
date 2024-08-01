import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError } from '../../common/src/errors/not-found-error';
import { errorHandler } from '../../common/src/middlewares/error-handler';

import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';

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

app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError('Not found');
});

app.use(errorHandler);

export { app };

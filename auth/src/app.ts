import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import { NotFoundError } from '../../common/src/errors/not-found-error';
import { errorHandler } from '../../common/src/middlewares/error-handler';

import { SignUpRouter } from './routes/signup';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(SignUpRouter);

app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError('Not found');
});

app.use(errorHandler);

export { app };

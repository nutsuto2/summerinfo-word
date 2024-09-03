import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser'
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler } from '@summerinfo/common';

import { startRouter } from './routes/start';
import { playRouter } from './routes/play';
import { endRouter } from './routes/end';
import { currentVocabularyRouter } from './routes/current-vocab';
import { usedVocabulariesRouter } from './routes/used-vocab';
import { healthRouter } from './routes/health';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    secure: false,
    signed: false
}));

app.use(startRouter);
app.use(playRouter);
app.use(endRouter);
app.use(currentVocabularyRouter);
app.use(usedVocabulariesRouter);
app.use(healthRouter);

app.all('*', async () => {
    throw new NotFoundError('Not found');
})

app.use(errorHandler);

export { app }; 

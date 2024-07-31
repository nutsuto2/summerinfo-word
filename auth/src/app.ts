import express from 'express';
import { json } from 'body-parser';

import { SignUpRouter } from './routes/signup';

const app = express();
app.use(json());

app.use(SignUpRouter);

export default app;

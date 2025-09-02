import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import v1Routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import mongoose from 'mongoose';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60_000, max: 60 }));

// Optional: connect to MongoDB when USE_MONGO=true
if (process.env.USE_MONGO === 'true') {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/todos_example';
  mongoose.connect(uri).then(() => console.log('Connected to MongoDB')).catch(err => {
    console.error('Mongo connection error', err);
  });
}

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/v1', v1Routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

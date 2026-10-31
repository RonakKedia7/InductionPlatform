import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import {connectDB} from './config/db.js';
import {ENV} from './config/env.js';
import applicationRoutes from './routes/application.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error: ', err);
  res.status(500).json({error: err.message || 'Internal server error'});
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`Server is running on PORT: ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
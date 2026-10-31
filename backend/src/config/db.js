import mongoose from 'mongoose';

import {ENV} from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);

    isConnected = conn.connection.readyState === 1;

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
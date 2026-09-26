import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    // Don't crash immediately in dev mode if local mongo isn't up yet
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

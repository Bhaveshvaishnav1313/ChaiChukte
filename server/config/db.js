import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  try {
    if (mongoUri && mongoUri !== 'mongodb://localhost:27017/chaichukta') {
      await mongoose.connect(mongoUri);
      isConnected = true;
      console.log(`[MongoDB] Connected to database: ${mongoose.connection.host}`);
      return;
    }

    // Try connecting to provided URI or local MongoDB
    try {
      await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/chaichukta', {
        serverSelectionTimeoutMS: 2000,
      });
      isConnected = true;
      console.log(`[MongoDB] Connected to local MongoDB: ${mongoose.connection.host}`);
    } catch {
      // In development, gracefully spin up in-memory MongoDB if no local daemon is running
      console.log('[MongoDB] Local MongoDB unavailable. Launching in-memory MongoDB...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      isConnected = true;
      console.log(`[MongoDB] In-memory MongoDB connected successfully at ${memoryUri}`);
    }
  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    throw error;
  }
}

export async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}

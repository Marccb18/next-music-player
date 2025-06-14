import mongoose from 'mongoose';

export * from './models/Users';
export * from './models/Groups';
export * from './models/Playlists';
export * from './models/Tracks';
export * from './models/Genres';
export * from './models/Releases';
export * from './models/Artists';

let isConnected = false;

export const connectMongo = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Add the MONGODB_URI environment variable inside .env.local to use mongoose');
  }

  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB,
      });
      isConnected = true;
      console.log('MongoDB connected');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export default connectMongo;

import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL!;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export const dbConnect = async () => {
    if (cached.conn) {
        return cached.conn;
    };
    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
        dbName: "clerkTaskivio",
        bufferCommands: false,
        connectTimeoutMS: 30000,
    });

    cached.conn = await cached.promise;
    return cached.conn;
}
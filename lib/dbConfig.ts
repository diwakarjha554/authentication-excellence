import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL!;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Define a type for the global object with the mongoose property
interface CustomGlobal {
    mongoose?: MongooseConnection;
}

// Declare the global object with the custom type
declare const global: CustomGlobal;

let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

export const dbConnect = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            dbName: 'clerkTaskivio',
            bufferCommands: false,
            connectTimeoutMS: 30000,
        };

        cached.promise = mongoose.connect(MONGODB_URL, opts);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

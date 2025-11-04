import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MONGODB_URI environment variable is required. See .env.example');
}

let client;
let db;

export async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(process.env.MONGODB_DB || 'admin');
        console.log('Connected to MongoDB');
    }
    return db;
}

export async function pingDatabase() {
    const database = await connectToDatabase();
    const result = await database.command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
    return result;
}

export default { connectToDatabase, pingDatabase };
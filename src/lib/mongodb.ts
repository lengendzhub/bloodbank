import { MongoClient, ObjectId } from "mongodb";

// Connection configuration - require MONGODB_URI in environment for safety
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI environment variable is required. Copy .env.example to .env and set it.");
}
const dbName = process.env.MONGODB_DB || "bloodbank";

let client: MongoClient | null = null;

async function getClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
    return client;
}

async function getDb() {
    const c = await getClient();
    return c.db(dbName);
}

// Create
export async function createDonor(donor: Record<string, any>) {
    const db = await getDb();
    const col = db.collection("donors");
    const result = await col.insertOne(donor);
    return result;
}

// Read all (with optional filter)
export async function getDonors(filter: Record<string, any> = {}) {
    const db = await getDb();
    const col = db.collection("donors");
    const docs = await col.find(filter).toArray();
    return docs;
}

// Read one by id
export async function getDonorById(id: string) {
    const db = await getDb();
    const col = db.collection("donors");
    const _id = new ObjectId(id);
    const doc = await col.findOne({ _id });
    return doc;
}

// Update
export async function updateDonor(donorId: string, updatedData: Record<string, any>) {
    const db = await getDb();
    const col = db.collection("donors");
    const _id = new ObjectId(donorId);
    const result = await col.updateOne({ _id }, { $set: updatedData });
    return result;
}

// Delete
export async function deleteDonor(donorId: string) {
    const db = await getDb();
    const col = db.collection("donors");
    const _id = new ObjectId(donorId);
    const result = await col.deleteOne({ _id });
    return result;
}

// Utility: close client
export async function closeClient() {
    if (client) {
        await client.close();
        client = null;
    }
}

export default {
    createDonor,
    getDonors,
    getDonorById,
    updateDonor,
    deleteDonor,
    closeClient,
};
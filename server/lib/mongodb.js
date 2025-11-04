import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI environment variable is required. See .env.example');
}
const dbName = process.env.MONGODB_DB || 'bloodbank';

let client;

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

export async function createDonor(donor) {
  const db = await getDb();
  const col = db.collection('donors');
  const res = await col.insertOne(donor);
  return res;
}

export async function getDonors(filter = {}) {
  const db = await getDb();
  const col = db.collection('donors');
  return col.find(filter).toArray();
}

export async function getDonorById(id) {
  const db = await getDb();
  const col = db.collection('donors');
  return col.findOne({ _id: new ObjectId(id) });
}

export async function updateDonor(id, updated) {
  const db = await getDb();
  const col = db.collection('donors');
  return col.updateOne({ _id: new ObjectId(id) }, { $set: updated });
}

export async function deleteDonor(id) {
  const db = await getDb();
  const col = db.collection('donors');
  return col.deleteOne({ _id: new ObjectId(id) });
}

export async function closeClient() {
  if (client) await client.close();
  client = null;
}

export default { createDonor, getDonors, getDonorById, updateDonor, deleteDonor, closeClient };

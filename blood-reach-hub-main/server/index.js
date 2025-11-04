import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Import DB helpers after dotenv is loaded. Use dynamic import so the DB module
// reads environment variables (MONGODB_URI) that dotenv populated.
const db = await import('./lib/mongodb.js');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/donors', async (req, res) => {
  try {
    const donors = await db.getDonors();
    // Normalize MongoDB ObjectId to string `id` and remove `_id` for frontend simplicity
    const normalized = donors.map(({ _id, ...rest }) => ({ id: _id?.toString(), ...rest }));
    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
});

app.post('/api/donors', async (req, res) => {
  try {
    const donor = req.body;
    const result = await db.createDonor(donor);
    res.status(201).json({ insertedId: result.insertedId.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create donor' });
  }
});

app.get('/api/donors/:id', async (req, res) => {
  try {
    const doc = await db.getDonorById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    const { _id, ...rest } = doc;
    res.json({ id: _id?.toString(), ...rest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch donor' });
  }
});

app.put('/api/donors/:id', async (req, res) => {
  try {
    const result = await db.updateDonor(req.params.id, req.body);
    res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update donor' });
  }
});

app.delete('/api/donors/:id', async (req, res) => {
  try {
    const result = await db.deleteDonor(req.params.id);
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete donor' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

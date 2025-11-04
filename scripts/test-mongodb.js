import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI environment variable is required for running scripts/test-mongodb.js. See .env.example');
}
const dbName = process.env.MONGODB_DB || 'bloodbank';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const col = db.collection('donors');

    // Insert dummy data
    const dummyDonors = [
      {
        name: 'John Smith',
        bloodGroup: 'A+',
        contactPhone: '+1-555-0101',
        contactEmail: 'john.smith@email.com',
        locationCity: 'New York',
        locationAddress: '123 Main St, NY 10001',
        latitude: 40.7128,
        longitude: -74.0060,
        availability: 'available',
        lastDonation: '2024-01-15',
        notes: 'Regular donor, very reliable',
        createdAt: new Date()
      },
      {
        name: 'Sarah Johnson',
        bloodGroup: 'O-',
        contactPhone: '+1-555-0102',
        contactEmail: 'sarah.j@email.com',
        locationCity: 'Los Angeles',
        locationAddress: '456 Oak Ave, LA 90210',
        latitude: 34.0522,
        longitude: -118.2437,
        availability: 'available',
        lastDonation: '2024-02-20',
        notes: 'Universal donor, emergency contact available',
        createdAt: new Date()
      },
      {
        name: 'Michael Brown',
        bloodGroup: 'B+',
        contactPhone: '+1-555-0103',
        contactEmail: 'm.brown@email.com',
        locationCity: 'Chicago',
        locationAddress: '789 Pine St, Chicago 60601',
        latitude: 41.8781,
        longitude: -87.6298,
        availability: 'emergency_only',
        lastDonation: '2023-12-10',
        notes: 'Available only for emergencies',
        createdAt: new Date()
      },
      {
        name: 'Emily Davis',
        bloodGroup: 'AB+',
        contactPhone: '+1-555-0104',
        contactEmail: 'emily.davis@email.com',
        locationCity: 'Houston',
        locationAddress: '321 Elm St, Houston 77001',
        latitude: 29.7604,
        longitude: -95.3698,
        availability: 'available',
        lastDonation: '2024-03-05',
        notes: 'First-time donor, very enthusiastic',
        createdAt: new Date()
      },
      {
        name: 'David Wilson',
        bloodGroup: 'A-',
        contactPhone: '+1-555-0105',
        contactEmail: 'd.wilson@email.com',
        locationCity: 'Phoenix',
        locationAddress: '654 Maple Dr, Phoenix 85001',
        latitude: 33.4484,
        longitude: -112.0740,
        availability: 'unavailable',
        lastDonation: '2024-01-30',
        notes: 'Temporarily unavailable due to travel',
        createdAt: new Date()
      }
    ];

    console.log('Inserting dummy donors...');
    const insertResults = await col.insertMany(dummyDonors);
    console.log(`Inserted ${insertResults.insertedCount} dummy donors`);

    // Read all donors
    const allDonors = await col.find({}).toArray();
    console.log(`Total donors in database: ${allDonors.length}`);

    // Test CRUD operations on first donor
    const firstDonor = allDonors[0];
    const id = firstDonor._id.toString();
    console.log('Testing CRUD on first donor:', firstDonor.name);

    // Update
    const updateRes = await col.updateOne({ _id: new ObjectId(id) }, { $set: { notes: 'Updated notes' } });
    console.log('Update matchedCount/modifiedCount:', updateRes.matchedCount, updateRes.modifiedCount);

    // Read after update
    const after = await col.findOne({ _id: new ObjectId(id) });
    console.log('After update notes:', after.notes);

    console.log('Test completed successfully!');

  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 2;
  } finally {
    await client.close();
  }
}

run();

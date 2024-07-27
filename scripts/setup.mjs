import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function setupDatabase() {
  if (!uri) {
    console.error('MONGODB_URI is not defined. Skipping database setup.');
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    // Create indexes
    await db.collection("tasks").createIndex({ title: 1 });
    await db.collection("tasks").createIndex({ category: 1 });

    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.close();
  }
}

setupDatabase().catch(console.error);
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

async function updateTasks() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("taskDB");
    const collection = db.collection("tasks");

    const newTask = {
      title: "New Task " + Date.now(),
      category: "Automatic",
      description: "Automatically added task",
    };

    const result = await collection.insertOne(newTask);
    console.log(`New task added with id: ${result.insertedId}`);

  } finally {
    await client.close();
  }
}

updateTasks().catch(console.error);
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../utils/database';
import { areSimilar } from '../../../utils/textSimilarity';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('tasks');

    if (req.method === 'GET') {
      const tasks = await collection.find({}).toArray();
      res.status(200).json(tasks);
    } else if (req.method === 'POST') {
      const newTask = req.body;

      // Fetch all existing tasks
      const existingTasks = await collection.find({}).toArray();

      // Check for similarity
      const newTaskText = `${newTask.title} ${newTask.category} ${newTask.description} ${newTask.example} ${newTask.testMethod}`;
      
      for (const task of existingTasks) {
        const existingTaskText = `${task.title} ${task.category} ${task.description} ${task.example} ${task.testMethod}`;
        
        if (areSimilar(newTaskText, existingTaskText, 0.8)) {
          return res.status(400).json({ error: 'This task is too similar to an existing one.' });
        }
      }

      // If we've made it here, the task is sufficiently unique
      const result = await collection.insertOne(newTask);
      res.status(201).json({ ...newTask, _id: result.insertedId });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../utils/database';

const DELETE_PASSWORD = process.env.DELETE_PASSWORD;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db();
    const tasksCollection = db.collection('tasks');

    if (req.method === 'DELETE') {
      const { password } = req.body;

      if (password !== DELETE_PASSWORD) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      const result = await tasksCollection.deleteOne({ _id: new ObjectId(id as string) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Task deleted successfully' });
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}
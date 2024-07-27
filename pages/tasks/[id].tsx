import React from 'react';
import { GetServerSideProps } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../utils/database';
import Layout from '../../components/Layout';
import styles from '../../styles/Tasks.module.css';

interface Task {
  _id: string;
  title: string;
  category: string;
  description: string;
  example?: string;
  testMethod?: string;
  links?: string[];
}

interface TaskDetailsProps {
  task: Task | null;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  if (!task) {
    return (
      <Layout>
        <div className={styles.container}>
          <h1 className={styles.title}>Task not found</h1>
          <p className={styles.error}>The requested task could not be found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{task.title}</h1>
        <p>Category: {task.category}</p>
        <p>{task.description}</p>
        {task.example && (
          <div>
            <h2>Example:</h2>
            <p>{task.example}</p>
          </div>
        )}
        {task.testMethod && (
          <div>
            <h2>Test Method:</h2>
            <p>{task.testMethod}</p>
          </div>
        )}
        {task.links && task.links.length > 0 && (
          <div>
            <h2>Links:</h2>
            <ul>
              {task.links.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const client = await clientPromise;
    const db = client.db();
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(id) });

    return {
      props: {
        task: JSON.parse(JSON.stringify(task)),
      },
    };
  } catch (error) {
    console.error('Error fetching task:', error);
    return {
      props: {
        task: null,
      },
    };
  }
};

export default TaskDetails;
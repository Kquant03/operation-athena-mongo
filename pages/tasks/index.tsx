import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import TaskList from '../../components/TaskList';
import styles from '../../styles/Tasks.module.css';
import { useAppContext } from '../../state/AppContext';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../utils/animations';
import Head from 'next/head';
import { useRouter } from 'next/router';

const TasksPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const tasks = await response.json();
        dispatch({ type: 'SET_TASKS', payload: tasks });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Error fetching tasks' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchTasks();
  }, [dispatch]);

  const handleDeleteTask = async (id: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        dispatch({ type: 'DELETE_TASK', payload: id });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  return (
    <Layout>
      <Head>
        <title>Task List</title>
      </Head>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className={styles.container}>
          {state.isLoading ? (
            <p className={styles.loading}>Loading tasks...</p>
          ) : state.error ? (
            <p className={styles.error}>{state.error}</p>
          ) : (
            <TaskList tasks={state.tasks} onDelete={handleDeleteTask} initialSearchValue={id as string} />
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default TasksPage;

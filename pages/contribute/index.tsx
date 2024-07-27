import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';
import styles from '../../styles/Contribute.module.css';
import { useAppContext } from '../../state/AppContext';
import { hasInappropriateContent } from '../../utils/contentFilter';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../utils/animations';
import Head from 'next/head';
import TaskSubmittedPopup from '../../components/TaskSubmittedPopup';
import { useState } from 'react';

const ContributePage = () => {
  const router = useRouter();
  const { dispatch } = useAppContext();
  const [showPopup, setShowPopup] = useState(false);
  const [submittedTaskId, setSubmittedTaskId] = useState('');

  const showTaskSubmittedPopup = (taskId: string) => {
    setSubmittedTaskId(taskId);
    setShowPopup(true);
  };

  const handleNewTask = async (formData: any) => {
    try {
      // Check if any of the form fields contain banned keywords
      if (
        hasInappropriateContent(formData.title) ||
        hasInappropriateContent(formData.category) ||
        hasInappropriateContent(formData.description) ||
        hasInappropriateContent(formData.example) ||
        hasInappropriateContent(formData.testMethod)
      ) {
        alert('The contribution contains inappropriate content and cannot be submitted.');
        return;
      }

      // Submit the task to an API route
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit task');
      }

      const newTask = await response.json();
      dispatch({ type: 'ADD_TASK', payload: newTask });
      showTaskSubmittedPopup(newTask._id);
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('An error occurred while submitting the task. Please try again.');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Contribute</title>
      </Head>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Contribute a Task</h1>
            <p className={styles.description}>
              Use the form below to submit a reasoning task to the Tasks List. You can use the current list as an example for the format of your contribution. There is a space to insert links to any relevant documents, you just have to put newlines between them in the form submission.
            </p>
            <ContributeForm onNewTask={handleNewTask} />
          </div>
        </div>
      </motion.div>
      {showPopup && (
        <TaskSubmittedPopup
          taskId={submittedTaskId}
          onClose={() => setShowPopup(false)}
        />
      )}
    </Layout>
  );
};

export default ContributePage;

import React from 'react';
import Image from 'next/image';
import styles from '../styles/TaskSubmittedPopup.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface TaskSubmittedPopupProps {
  taskId: string;
  onClose: () => void;
}

const TaskSubmittedPopup: React.FC<TaskSubmittedPopupProps> = ({ taskId, onClose }) => {
  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const popupTransition = {
    type: 'spring',
    damping: 20,
    stiffness: 300,
  };

  return (
    <div className={styles.overlay}>
      <motion.div
        className={styles.popup}
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={popupTransition}
      >
        <div className={styles.contentWrapper}>
          <div className={styles.textWrapper}>
            <div className={styles.titleWrapper}>
              <Image
                src="/athena-icon.png"
                alt="Athena Icon"
                width={50}
                height={50}
                className={styles.icon}
              />
              <h2 className={styles.title}>Task Submitted</h2>
            </div>
            <p className={styles.message}>
              Thank you for contributing to Operation Athena!
            </p>
            <p className={styles.taskId}>
              Your task ID is: <span>{taskId}</span>
            </p>
            <div className={styles.buttonContainer}>
              <Link href={`/tasks?id=${taskId}`}>
                <button className={styles.viewTaskButton}>View Task</button>
              </Link>
              <button className={styles.closeButton} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskSubmittedPopup;

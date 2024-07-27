// components/TaskDetails.tsx
import React from 'react'
import styles from '../styles/TaskDetails.module.css'

interface TaskDetailsProps {
  task: {
    id: string;
    title: string;
    description: string;
  }
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  return (
    <div className={styles.taskDetails}>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
    </div>
  )
}

export default TaskDetails
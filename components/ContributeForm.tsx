import React, { useState } from 'react';
import styles from '../styles/ContributeForm.module.css';
import { filterInappropriateContent } from '../utils/contentFilter';
import { areSimilar } from '../utils/textSimilarity';

interface ContributeFormProps {
  onNewTask: (formData: any) => void;
}

const ContributeForm: React.FC<ContributeFormProps> = ({ onNewTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [example, setExample] = useState('');
  const [testMethod, setTestMethod] = useState('');
  const [links, setLinks] = useState('');
  const [tags, setTags] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredTitle = filterInappropriateContent(title);
    const filteredDescription = filterInappropriateContent(description);
    const filteredExample = filterInappropriateContent(example);
    const filteredTestMethod = filterInappropriateContent(testMethod);

    if (filteredTitle !== title || filteredDescription !== description || 
        filteredExample !== example || filteredTestMethod !== testMethod) {
      setWarningMessage('Warning: Inappropriate content detected and filtered.');
      return;
    }

    // Check for similarity with existing tasks
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const existingTasks = await response.json();

      const newTaskText = `${filteredTitle} ${category} ${filteredDescription} ${filteredExample} ${filteredTestMethod}`;

      for (const task of existingTasks) {
        const existingTaskText = `${task.title} ${task.category} ${task.description} ${task.example} ${task.testMethod}`;
        
        if (areSimilar(newTaskText, existingTaskText, 0.8)) {
          setWarningMessage('This task is too similar to an existing one. Please submit a more unique task.');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking task similarity:', error);
      setWarningMessage('An error occurred while checking task similarity. Please try again.');
      return;
    }

    // If we've made it here, the task is sufficiently unique
    setWarningMessage('');

    onNewTask({
      title: filteredTitle,
      category,
      description: filteredDescription,
      example: filteredExample,
      testMethod: filteredTestMethod,
      links: links.split('\n').filter(link => link.trim() !== ''),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    });

    // Reset form fields
    setTitle('');
    setCategory('');
    setDescription('');
    setExample('');
    setTestMethod('');
    setLinks('');
    setTags('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="category" className={styles.label}>Category:</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
          required
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="example" className={styles.label}>Example(s):</label>
        <textarea
          id="example"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          className={styles.textarea}
          required
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="testMethod" className={styles.label}>Test Method (if none put N/A):</label>
        <textarea
          id="testMethod"
          value={testMethod}
          onChange={(e) => setTestMethod(e.target.value)}
          className={styles.textarea}
          required
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="links" className={styles.label}>Links (one per line):</label>
        <textarea
          id="links"
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          className={styles.textarea}
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="tags" className={styles.label}>Tags (Separate, These, With, Commas ):</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags separated by commas"
          className={styles.input}
        />
      </div>
      
      {warningMessage && (
        <div className={styles.warning}>{warningMessage}</div>
      )}
      
      <button type="submit" className={styles.submitButton}>
        Submit
      </button>
    </form>
  );
};

export default ContributeForm;

import React, { useState, useEffect } from 'react';
import styles from '../styles/TaskList.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  _id: string;
  title?: string;
  category?: string;
  description?: string;
  example?: string;
  testMethod?: string;
  links?: string[];
  tags?: string[];
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string, password: string) => Promise<boolean>;
  initialSearchValue?: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, initialSearchValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [idSearchTerm, setIdSearchTerm] = useState(initialSearchValue);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);
  const [showTagsCard, setShowTagsCard] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reportingTaskId, setReportingTaskId] = useState<string | null>(null);
  const [currentTagPage, setCurrentTagPage] = useState(0);
  const [sortBy, setSortBy] = useState<'oldest' | 'newest' | 'alphabetical'>('newest');
  const [showTagsButton, setShowTagsButton] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deleteMessageType, setDeleteMessageType] = useState<'success' | 'error' | null>(null);

  const tagsPerPage = 8;

  useEffect(() => {
    console.log('TaskList received tasks:', tasks);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setShowTagsButton(true);
      }, 100);
    });
  }, [tasks]);

  const getTagCounts = () => {
    const tagCounts: {[key: string]: number} = {};
    tasks.forEach(task => {
      task.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return tagCounts;
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
    
    // Close tags panel on mobile after selection for better UX
    if (window.innerWidth <= 768) {
      setTimeout(() => setShowTagsCard(false), 300);
    }
  };

  const paginatedTags = () => {
    const allTags = Object.entries(getTagCounts()).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
    const startIndex = currentTagPage * tagsPerPage;
    return allTags.slice(startIndex, startIndex + tagsPerPage);
  };

  const sortTasks = (tasksToSort: Task[]) => {
    switch (sortBy) {
      case 'oldest':
        return [...tasksToSort].sort((a, b) => a._id.localeCompare(b._id));
      case 'newest':
        return [...tasksToSort].sort((a, b) => b._id.localeCompare(a._id));
      case 'alphabetical':
        return [...tasksToSort].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      default:
        return tasksToSort;
    }
  };

  const filteredTasks = sortTasks(tasks.filter(task =>
    (idSearchTerm === '' || task._id.toLowerCase().includes(idSearchTerm.toLowerCase())) &&
    (searchTerm === '' || 
      (task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (task.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    ) &&
    (selectedTags.length === 0 || selectedTags.every(tag => task.tags?.includes(tag)))
  ));

  const toggleTask = (id: string) => {
    setExpandedTask(prevExpandedTask => prevExpandedTask === id ? null : id);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setSidePanelOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        const success = await onDelete(deleteId, deletePassword);
        if (success) {
          setDeleteMessage('Task deleted successfully!');
          setDeleteMessageType('success');
          setTimeout(() => {
            setDeleteMessage(null);
            setDeleteMessageType(null);
            setDeleteId(null);
            setDeletePassword('');
            setSidePanelOpen(false);
          }, 2000);
        } else {
          setDeleteMessage('Incorrect password. Delete failed.');
          setDeleteMessageType('error');
          setTimeout(() => {
            setDeleteMessage(null);
            setDeleteMessageType(null);
          }, 2000);
        }
      } catch (error) {
        setDeleteMessage('An error occurred. Delete failed.');
        setDeleteMessageType('error');
        setTimeout(() => {
          setDeleteMessage(null);
          setDeleteMessageType(null);
        }, 2000);
      }
    }
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tasks.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleCopyTask = (task: Task) => {
    const taskText = `Title: ${task.title || 'Untitled Task'}
Category: ${task.category || 'Uncategorized'}
Description: ${task.description || 'No description provided'}
Example: ${task.example || 'No example provided'}
Test Method: ${task.testMethod || 'No test method provided'}
Links: ${task.links?.join(', ') || 'No links provided'}
Tags: ${task.tags?.join(', ') || 'No tags provided'}`;

    navigator.clipboard.writeText(taskText).then(() => {
      setCopiedTaskId(task._id);
      setTimeout(() => setCopiedTaskId(null), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const handleReportClick = (id: string) => {
    setReportingTaskId(prevId => prevId === id ? null : id);
    setReportReason('');
  };

  const handleReportConfirm = async (id: string) => {
    try {
      const response = await fetch('/api/report-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: id, reason: reportReason }),
      });

      if (response.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setReportSuccess(false);
          setReportingTaskId(null);
        }, 2000);
      } else {
        alert('Failed to report task');
      }
    } catch (error) {
      console.error('Error reporting task:', error);
      alert('An error occurred while reporting the task');
    }
  };

  // Mobile-specific handler for closing tags modal
  const handleTagsClose = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Close if clicking the ::before pseudo-element (close button) or the backdrop
    if (target.classList.contains(styles.tagsCard)) {
      setShowTagsCard(false);
    }
  };

  return (
    <div className={styles.pageLayout}>
      <div className={styles.taskListContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Task List</h1>
          <p className={styles.pageDescription}>This is a comprehensive list of reasoning tasks which are carefully curated into a JSON file that you can download and parse however you like.</p>
        </div>
        <div className={styles.header}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <input
              type="text"
              placeholder="Search by ID..."
              value={idSearchTerm}
              onChange={(e) => setIdSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button onClick={handleDownload} className={styles.downloadButton}>
            Download Tasks JSON
          </button>
        </div>
        
        <div className={styles.contentWrapper}>
          <div className={styles.sortContainer}>
            <label htmlFor="sortSelect">Sort by: </label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'oldest' | 'newest' | 'alphabetical')}
              className={styles.sortSelect}
            >
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
          
          {filteredTasks.length === 0 ? (
            <p className={styles.noTasks}>No tasks found.</p>
          ) : (
            <ul className={styles.list}>
              {filteredTasks.map((task) => (
                <li 
                  key={task._id} 
                  className={`${styles.listItem} ${expandedTask === task._id ? styles.expanded : ''}`}
                  onClick={() => toggleTask(task._id)}
                >
                  <div className={styles.listItemHeader}>
                    <h3 className={styles.listItemTitle}>{task.title || 'Untitled Task'}</h3>
                    <span className={styles.listItemCategory}>{task.category || 'Uncategorized'}</span>
                  </div>
                  {task.tags && task.tags.length > 0 && (
                    <div className={styles.tagList}>
                      {task.tags.map((tag, index) => (
                        <span key={index} className={styles.listItemTag}>{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className={styles.listItemContent}>
                    <div className={styles.contentSection}>
                      <h4>Description:</h4>
                      <pre className={styles.preformattedText}>{task.description || 'No description provided'}</pre>
                    </div>
                    {task.example && (
                      <div className={styles.contentSection}>
                        <h4>Example(s):</h4>
                        <pre className={styles.preformattedText}>{task.example}</pre>
                      </div>
                    )}
                    {task.testMethod && (
                      <div className={styles.contentSection}>
                        <h4>Test Method:</h4>
                        <pre className={styles.preformattedText}>{task.testMethod}</pre>
                      </div>
                    )}
                    {task.links && task.links.length > 0 && (
                      <div className={styles.contentSection}>
                        <h4>Links:</h4>
                        <ul>
                          {task.links.map((link, index) => (
                            <li key={index}>
                              <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className={styles.contentSection}>
                      <h4>Task ID:</h4>
                      <p className={styles.taskId}>{task._id}</p>
                    </div>
                    <div className={styles.buttonContainer}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyTask(task);
                        }}
                        className={styles.copyButton}
                        aria-label={copiedTaskId === task._id ? "Copied!" : "Copy task"}
                      >
                        {copiedTaskId === task._id ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(task._id);
                        }}
                        className={styles.deleteButton}
                        aria-label="Delete task"
                      >
                        Delete
                      </button>
                      {reportingTaskId === task._id ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setReportingTaskId(null);
                            }}
                            className={styles.cancelReport}
                            aria-label="Cancel report task"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReportConfirm(task._id);
                            }}
                            className={styles.confirmReport}
                            aria-label="Confirm report task"
                          >
                            Report
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReportClick(task._id);
                          }}
                          className={styles.reportButton}
                          aria-label="Report task"
                        >
                          Report
                        </button>
                      )}
                    </div>
                    {reportingTaskId === task._id && (
                      <div className={styles.reportFormContainer}>
                        <textarea
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          placeholder="Please provide a reason for reporting this task..."
                          className={styles.reportReason}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button 
        onClick={() => setShowTagsCard(!showTagsCard)} 
        className={`${styles.showTagsButton} ${showTagsButton ? styles.showTagsButtonVisible : ''}`}
        aria-hidden={!showTagsButton}
      >
        {showTagsCard ? 'Hide Tags' : 'Show Tags'}
      </button>

      <div 
        className={`${styles.tagsCard} ${showTagsCard ? styles.open : ''}`}
        onClick={handleTagsClose}
      >
        <div 
          className={styles.tagsCardContent}
          onClick={(e) => e.stopPropagation()}
        >
          <h3>Filter by Tags</h3>
          <div className={styles.tagGrid}>
            {paginatedTags().map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={selectedTags.includes(tag) ? styles.selectedTag : styles.tag}
              >
                <span className={styles.tagText}>{tag}</span>
                <span className={styles.tagCount}>{getTagCounts()[tag]}</span>
              </button>
            ))}
          </div>
          <div className={styles.tagPagination}>
            <button
              onClick={() => setCurrentTagPage(prev => Math.max(0, prev - 1))}
              disabled={currentTagPage === 0}
              className={styles.pageButton}
            >
              <FaChevronLeft />
            </button>
            <span>{currentTagPage + 1}</span>
            <button
              onClick={() => setCurrentTagPage(prev => prev + 1)}
              disabled={(currentTagPage + 1) * tagsPerPage >= Object.keys(getTagCounts()).length}
              className={styles.pageButton}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.sideCard} ${sidePanelOpen ? styles.open : ''}`}>
        <div className={styles.sideCardContent}>
          <h2>Delete Task</h2>
          <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Enter password"
            className={styles.passwordInput}
          />
          <div className={styles.sideCardButtons}>
            <button onClick={handleDeleteConfirm} className={styles.confirmButton}>Confirm</button>
            <button onClick={() => setSidePanelOpen(false)} className={styles.cancelButton}>Cancel</button>
          </div>
          <AnimatePresence>
            {deleteMessage && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={`${styles.deleteMessage} ${styles[deleteMessageType || '']}`}
              >
                {deleteMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {reportSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={styles.successMessage}
          >
            Task reported successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
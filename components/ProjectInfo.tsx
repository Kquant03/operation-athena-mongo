import React from 'react';
import styles from '../styles/ProjectInfo.module.css';

const ProjectInfo: React.FC = () => {
  return (
    <section className={styles.projectInfo}>
      <div className={styles.content}>
        <h2>About Operation Athena</h2>
        <p>
          Operation Athena is a collaborative initiative focused on advancing artificial intelligence through the compilation and analysis of diverse reasoning tasks. The original idea for this website came from <a href="https://github.com/NousResearch/Open-Reasoning-Tasks/tree/main" target="_blank" rel="noopener noreferrer">Nous Research</a>, as well as the <a href="https://github.com/NousResearch/Open-Reasoning-Tasks/blob/main/tasks.md" target="_blank" rel="noopener noreferrer">majority of existing data in the current database</a>, as of July 28th, 2024.
        </p>
        <p>
          In the AI industry, there is a need for diverse datasets that can provide the full depth and complexity of human experience. So it's vital to make sure everyone has a chance to get their own ideas into these systems as a way of helping models deepen their understanding and ability to succeed at things in real-world applications.
        </p>
        <p>
          Join us in our mission to create a master list of reasoning tasks that will drive the development of more sophisticated and adaptable AI systems.
        </p>
      </div>
    </section>
  );
};

export default ProjectInfo;

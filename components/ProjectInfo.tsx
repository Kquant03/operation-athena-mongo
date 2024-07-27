import React from 'react';
import styles from '../styles/ProjectInfo.module.css';

const ProjectInfo: React.FC = () => {
  return (
    <section className={styles.projectInfo}>
      <div className={styles.content}>
        <h2>About Operation Athena</h2>
        <p>
          Operation Athena is a collaborative initiative focused on advancing artificial intelligence through the compilation and analysis of diverse reasoning tasks. Our goal is to create a comprehensive reference document that helps dataset creators and researchers improve AI reasoning skills.
        </p>
        <p>
          By bringing together a wide range of task categories, from mathematical word problems to identifying subtle inconsistencies, we aim to push the boundaries of AI capabilities and foster innovation in the field.
        </p>
        <p>
          Join us in our mission to create a master list of reasoning tasks that will drive the development of more sophisticated and adaptable AI systems.
        </p>
      </div>
    </section>
  );
};

export default ProjectInfo;
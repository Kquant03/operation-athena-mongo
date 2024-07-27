import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import styles from '../../styles/About.module.css';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../utils/animations';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Head>
          <title>About Operation Athena</title>
          <meta name="description" content="Learn more about Operation Athena and our mission to advance AI reasoning capabilities" />
        </Head>
        <section className={styles.aboutSection}>
          <div className={styles.content}>
            <h1>About Operation Athena</h1>
            <p>
              Operation Athena is a community-driven project aimed at compiling a comprehensive list of reasoning tasks to advance artificial intelligence capabilities. Our mission is to create a master reference document that will serve as a valuable resource for dataset creators, researchers, and AI enthusiasts.
            </p>
            <h2>Our Objectives</h2>
            <ul>
              <li>Compile diverse reasoning task categories</li>
              <li>Provide clear descriptions and examples for each task type</li>
              <li>Identify edge cases and outliers that challenge AI systems</li>
              <li>Explore frameworks that enhance reasoning capabilities</li>
              <li>Foster collaboration among AI researchers and enthusiasts</li>
            </ul>
            <h2>Task Categories</h2>
            <p>
              We're collecting a wide range of task categories, including but not limited to:
            </p>
            <ul>
              <li>Mathematical Word Problems</li>
              <li>Identifying Properties of Entities</li>
              <li>Systems Thinking Frameworks</li>
              <li>Out-of-Distribution Reasoning</li>
              <li>Pattern Recognition in Inconsistent Data</li>
              <li>Adapting to Subtle "Wrong" Patterns</li>
            </ul>
            <h2>Contribute to Operation Athena</h2>
            <p>
              We invite researchers, developers, and AI enthusiasts to contribute their ideas for reasoning tasks. By participating, you can:
            </p>
            <ul>
              <li>Share your unique perspectives on reasoning challenges</li>
              <li>Help identify edge cases that push AI capabilities</li>
              <li>Collaborate with a community of like-minded individuals</li>
              <li>Contribute to the advancement of AI reasoning skills</li>
            </ul>
            <p>
              Together, we can create a valuable resource that drives innovation in AI reasoning and helps develop more sophisticated, adaptable, and capable AI systems.
            </p>
          </div>
        </section>
      </motion.div>
    </Layout>
  );
};

export default AboutPage;
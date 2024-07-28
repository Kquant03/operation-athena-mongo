// pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ProjectInfo from '../components/ProjectInfo';
import styles from '../styles/Home.module.css';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../utils/animations';

const Home: NextPage = () => {
  return (
    <Layout>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className={styles.container}>
          <Head>
            <title>Operation Athena</title>
            <meta name="description" content="Curating Reasoning Tasks for LLMs" />
          </Head>

          <Hero />
          <ProjectInfo />
        </div>
      </motion.div>
    </Layout>
  );
};

export default Home;

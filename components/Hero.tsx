// components/Hero.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Hero.module.css';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
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
            <h1 className={styles.title}>Operation Athena</h1>
          </div>
          <p className={styles.subtitle}>Curating reasoning tasks for LLMs</p>
          <div className={styles.cta}>
            <Link href="/contribute">
              <span className={`${styles.transparentButton} ${styles.primaryButton}`}>Join the Mission</span>
            </Link>
            <Link href="/about">
              <span className={`${styles.transparentButton} ${styles.secondaryButton}`}>Learn More</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
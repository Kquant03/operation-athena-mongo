import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        &copy; This project is licensed under the{' '}
        <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer" className={styles.linkHover}>
          MIT License
        </a>
        .
      </p>
      <p>
        &copy; Made with Anthropic&apos;s{' '}
        <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer" className={styles.linkHover}>
          Claude 3 Opus and Sonnet 3.5
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;

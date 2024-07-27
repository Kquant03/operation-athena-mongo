import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <Image 
          src="/athena-icon.png"
          alt="Athena Icon"
          width={40}
          height={40}
          className={styles.icon}
        />
      </div>
      <nav>
        <Link href="/" className={styles.navLink}>Home</Link>
        <Link href="/about" className={styles.navLink}>About</Link>
        <Link href="/tasks" className={styles.navLink}>Tasks</Link>
        <Link href="/contribute" className={styles.navLink}>Contribute</Link>
        <Link href="/license" className={styles.navLink}>MIT License</Link>
      </nav>
    </header>
  );
};

export default Header;
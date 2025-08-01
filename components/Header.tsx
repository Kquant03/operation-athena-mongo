import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
      <button 
        className={styles.menuToggle}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <nav className={isMenuOpen ? styles.open : ''}>
        <Link href="/" className={styles.navLink} onClick={closeMenu}>Home</Link>
        <Link href="/about" className={styles.navLink} onClick={closeMenu}>About</Link>
        <Link href="/tasks" className={styles.navLink} onClick={closeMenu}>Tasks</Link>
        <Link href="/contribute" className={styles.navLink} onClick={closeMenu}>Contribute</Link>
        <Link href="/license" className={styles.navLink} onClick={closeMenu}>MIT License</Link>
      </nav>
    </header>
  );
};

export default Header;
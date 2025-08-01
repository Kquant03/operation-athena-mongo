// pages/admin/import.tsx
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/Admin.module.css';
import Head from 'next/head';

const ImportPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsImporting(true);
    setError(null);
    setImportResult(null);

    try {
      const response = await fetch('/api/import-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setImportResult(data);
      } else {
        setError(data.error || 'Import failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Import Tasks - Admin</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Import Tasks from Nous Research</h1>
          <p className={styles.description}>
            This will import all tasks from the Nous Research Open-Reasoning-Tasks repository.
            Duplicate tasks (by title) will be skipped.
          </p>
          
          <form onSubmit={handleImport} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Admin Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
                disabled={isImporting}
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isImporting}
            >
              {isImporting ? 'Importing...' : 'Start Import'}
            </button>
          </form>

          {error && (
            <div className={styles.error}>
              Error: {error}
            </div>
          )}

          {importResult && (
            <div className={styles.success}>
              <h3>Import Complete!</h3>
              <p>✅ Imported: {importResult.imported} tasks</p>
              <p>⏭️ Skipped: {importResult.skipped} duplicates</p>
              {importResult.errors && importResult.errors.length > 0 && (
                <div className={styles.errorList}>
                  <h4>Errors encountered:</h4>
                  <ul>
                    {importResult.errors.map((err: string, index: number) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className={styles.info}>
            <h3>Source Information:</h3>
            <p>
              Repository: <a 
                href="https://github.com/NousResearch/Open-Reasoning-Tasks" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                NousResearch/Open-Reasoning-Tasks
              </a>
            </p>
            <p>
              This import will fetch all JSON files from the <code>tasks-json</code> folder
              and convert them to your database format.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ImportPage;
// pages/license.tsx
import React from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/License.module.css';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../utils/animations';
import Head from 'next/head';

const LicensePage: React.FC = () => {
    return (
        <Layout>
          <Head>
           <title>MIT License</title>
          </Head>
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>License Information</h1>
          <p className={styles.description}>
            This project is licensed under the{' '}
            <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer" className={styles.linkHover}>
              MIT License
            </a>
            .
          </p>
          <div className={styles.licenseText}>
            {/* Full text of the MIT License */}
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the &quot;Software&quot;), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>
            <p>
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>
            <p>
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
                <p>
                  Please note that this website is hosted on Vercel, and Vercel logs certain user data, including user strings, 
                  which are accessible to the website owner. These user strings contain information such as browser versions, 
                  operating system names (e.g., Windows or Ubuntu), and browser base information (e.g., Gecko). This data is collected 
                  for the purpose of troubleshooting and improving the website's functionality. No personally identifiable information 
                  is collected through these user strings.
                </p>
                <p>
                  For more information about Vercel's data practices, please refer to their {' '}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className={styles.linkHover}>
                    Privacy Policy
                  </a>.
                </p>
          </div>
          <div className={styles.finePrint}>
              <p>
                In simple terms: I'm not here for user credentials, a lot of that identification stuff serves no purpose in training an LLM. That's why there's not even a login page on this website. Also, Feel free to use, modify, and distribute this code however you like. 
                Whether it's for personal projects, commercial use, or even world domination (Claude's suggestion, not mine), 
                go ahead and make it your own. If you're curious about how we built this or want to create something similar, 
                check out our source code here: {' '}
                <a 
                  href="https://github.com/Kquant03/operation-athena-mongo/tree/main" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.linkHover}
                >
                  GitHub Repository
                </a>
                . Happy coding!
              </p>
            </div>
        </div>
      </div>
      </motion.div>
      </Layout>
  );
};

export default LicensePage;

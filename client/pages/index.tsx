import React from 'react';
import Layout from '../components/common/Layout';

/**
 * Route: '/'
 * Api: Query currentUser's projects / Activity / Cards
 */
import styles from './Dashboard.module.less'

const Dashboard = () => {
  return (
    <Layout>
      <div className={styles.main}>
        This is the dashboard
      </div>
    </Layout>
  );
};

export default Dashboard;

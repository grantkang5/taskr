import React from 'react';
import { Empty } from 'antd';
import Layout from '../Layout';

import styles from './ErrorLayout.module.less'

const ErrorLayout: React.FC = () => {
  return (
    <Layout hide={1}>
      <div className={styles.errorLayout}>
      <Empty
        image="/static/error/4x/square-remove-12@4x.png"
        imageStyle={{
          opacity: 0.6
        }}
        description={
          <span>Oops! Something went wrong.</span>
        }
      />
      </div>
    </Layout>
  )
}

export default ErrorLayout;
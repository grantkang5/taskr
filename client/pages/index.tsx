import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
// import { withRouter, SingletonRouter } from 'next/router';

interface Props {}

const LandingPage: React.FC<Props> = () => {
  console.log('RENDERING landing page');

  return (
    <Layout>
      <Head>
        <title>zawarudo</title>
      </Head>
    </Layout>
  );
};

export default LandingPage;

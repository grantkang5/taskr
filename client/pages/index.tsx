import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useMeQuery } from '../generated/graphql';

const Home: React.FC = () => {
  const { data } = useMeQuery();

  if (!data) {
    return (
      <Layout>
        <div />
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>zawarudo</title>
      </Head>
    </Layout>
  );
};

export default Home;

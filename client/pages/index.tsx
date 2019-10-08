import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useMeQuery } from '../generated/graphql';

const Home: React.FC = () => {
  const { data } = useMeQuery({ fetchPolicy: 'network-only' });

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
        <title>Dorya</title>
      </Head>
    </Layout>
  );
};

export default Home;

import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useMeQuery } from '../generated/graphql';

interface Props {}

const Home: React.FC<Props> = () => {
  const { data } = useMeQuery({ fetchPolicy: 'network-only' });
  console.log(process.env.NODE_ENV, process.env.API_URL)
  console.log('env var from host: ', process.env.SOMETHING)

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

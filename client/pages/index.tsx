import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useMeQuery } from '../generated/graphql';

interface Props {}

const Home: React.FC<Props> = () => {
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
        <title>Cool App Title</title>
      </Head>
      {data && data.me ? (
        <div>You are logged in as {data.me.email}</div>
      ) : (
        <div>HOME</div>
      )}
    </Layout>
  );
};

export default Home;

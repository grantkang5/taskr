import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useMeQuery } from '../generated/graphql';
import { useApolloClient } from '@apollo/react-hooks';

interface Props {}

const Home: React.FC<Props> = () => {
  const { data } = useMeQuery();
<<<<<<< HEAD
=======
  // console.log(process.env.NODE_ENV, process.env.API_URL)
  // console.log('env var from host: ', process.env.SOMETHING)
  // console.log('client is ', client.cache);
>>>>>>> 9b25b7ed05e7bb2ab193fa3f1bf4aa9a9c61338a

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

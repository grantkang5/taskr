import React from 'react';
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../components/Layout';
import { getAccessToken } from '../lib/accessToken';

interface Props {}

const Home: React.FC<Props> = () => {
  // dashboard
  return <Layout>I AM HOME</Layout>;
};

export default PrivateRoute(Home);

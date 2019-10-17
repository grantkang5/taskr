import App from 'next/app';
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { withApollo } from '../lib/apollo';
import PrivateRoute from '../components/PrivateRoute';

class MyApp extends App<any> {
  render() {
    console.log(process.env.NODE_ENV, process.env.CLIENT_URL);
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ApolloProvider client={apolloClient}>
        <PrivateRoute>
          <Component {...pageProps} />
        </PrivateRoute>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);

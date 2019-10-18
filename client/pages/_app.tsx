import App from "next/app";
import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { withApollo } from "../lib/apollo";
import PrivateRoute from "../components/PrivateRoute";
import Cookie from 'js-cookie'

interface Props {
  apolloClient: any
}

import './App.module.less'

class MyApp extends App<Props> {
  componentWillMount() {
    const cookie = Cookie.get('qid')
    console.log('THIS COOKIE IS DA BEST IN UNQWILLQMOUNT')
  }

  render() {
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

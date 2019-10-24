import App from "next/app";
import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { withApollo } from "../lib/apollo";
import AuthProvider from "../components/AuthProvider";

interface Props {
  apolloClient: any
}

import './App.module.less'

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);

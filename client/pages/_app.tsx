import "./App.module.less";
import App from "next/app";
import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { withApollo } from "../lib/apollo";
import AuthProvider from "../components/auth/AuthProvider";
import { ModalProvider } from "../components/modals";

interface Props {
  apolloClient: any;
}


class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ApolloProvider client={apolloClient}>
        <ModalProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </ModalProvider>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);

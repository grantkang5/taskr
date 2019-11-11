import "./App.less";
import App from "next/app";
import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { withApollo } from "../lib/apollo";
import AuthProvider from "../components/auth/AuthProvider";
import { ModalProvider } from "../components/modals";
import { DndProvider } from "react-dnd-cjs";
import HTML5Backend from "react-dnd-html5-backend-cjs";

interface Props {
  apolloClient: any;
}

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ApolloProvider client={apolloClient}>
        <DndProvider backend={HTML5Backend}>
          <ModalProvider>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </ModalProvider>
        </DndProvider>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);

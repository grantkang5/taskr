import React from 'react';
import { useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';

interface Props {
  children: React.ReactNode;
}

class PrivateRoute extends React.Component<Props> {
  static async getInitialProps(ctx: any) {
    console.log("PRIVATE ROUTE CONTEXT: ", ctx)
  }
  // const { data, loading } = useMeQuery();

  // const whitelist = ['/login', '/register', '/home', '/google'];

  // if (loading) {
  //   // TODO: add load screen
  //   return <></>;
  // }
  // // not authenticated, redirect unless it's in whitelist
  // if (!whitelist.includes(router.route) && !data) {
  //   router.push('/login');
  //   return <></>;
  // }
  render() {
    return <>{this.props.children}</>;
  }
};

export default PrivateRoute;

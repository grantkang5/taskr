import React from "react";
import { useByeQuery } from "../../generated/graphql";
import Layout from "../../components/Layout";
import { Button } from 'antd'

const Bye: React.FC = () => {
  const { error } = useByeQuery({ fetchPolicy: "network-only" });

  if (error) {
    return <Layout>{error.message}</Layout>;
  }
  return <Layout><Button type="primary">hello world</Button></Layout>;
};

export default Bye;

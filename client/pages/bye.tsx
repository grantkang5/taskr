import React from "react";
import { useByeQuery } from "../generated/graphql";
import Layout from "../components/Layout";

interface Props {}

const Bye: React.FC<Props> = () => {
  const { data, error } = useByeQuery({ fetchPolicy: "network-only" });

  if (error) {
    return <Layout>{error.message}</Layout>;
  }
  return <Layout>{JSON.stringify(data)}</Layout>;
};

export default Bye;

import React from "react";
import { useByeQuery } from "../generated/graphql";
import Layout from "../components/Layout";

const Bye: React.FC = () => {
  const { error } = useByeQuery({ fetchPolicy: "network-only" });

  if (error) {
    return <Layout>{error.message}</Layout>;
  }
  return <Layout></Layout>;
};

export default Bye;

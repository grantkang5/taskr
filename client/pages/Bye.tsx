import React from "react";
import { useByeQuery } from "../generated/graphql";

interface Props {}

const Bye: React.FC<Props> = () => {
  const { data, error } = useByeQuery({ fetchPolicy: "network-only" });
  if (error) {
    return <div>{error.message}</div>;
  }
  return <div>{JSON.stringify(data)}</div>;
};

export default Bye;

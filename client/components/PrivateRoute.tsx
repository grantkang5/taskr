import React from "react";
import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import Dashboard from "../pages";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { data, loading } = useMeQuery();

  const whitelist = ["/login", "/register", "/home", "/google"];

  if (loading) {
    // TODO: add load screen
    return <></>;
  }

  // not authenticated, redirect unless it's in whitelist
  if (!whitelist.includes(router.route) && !data) {
    router.push("/login");
    return <></>;
  }
  return <>{children}</>;
};

export default PrivateRoute;

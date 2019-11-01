import React, { useEffect } from "react";
import { useMeQuery } from "../../generated/graphql";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (data && whiteList.includes(router.route)) {
      router.push("/error", "/");
    }
  }, [data]);

  const anonList = ["/invite/team/success"];

  const whiteList = [
    "/login",
    "/register",
    "/home",
    "/forgot-password",
    "/forgot-password/success",
    "/google",
    "/email-verification",
    "/email-verification/success"
  ];

  if (loading) {
    // TODO: add load screen
    return <></>;
  }

  // not authenticated, redirect unless it's in whiteList
  if (
    !data &&
    !whiteList.includes(router.route) &&
    !anonList.includes(router.route)
  ) {
    router.push("/login");
    return <></>;
  }
  return <>{children}</>;
};

export default AuthProvider;

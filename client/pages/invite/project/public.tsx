import React, { useEffect } from "react";
import Layout from "../../../components/layouts/Layout";
import { useRouter } from "next/router";
import {
  useMeQuery,
  useAcceptPublicProjectLinkMutation
} from "../../../generated/graphql";
import { message } from "antd";
import AnonLayout from "../../../components/layouts/AnonLayout";

const PublicProjectInvitePage: React.FC = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();
  const [acceptProjectLink] = useAcceptPublicProjectLinkMutation();

  useEffect(() => {
    let didCancel = false;
    if (!router.query.project || !router.query.id) {
      router.push("/error", "/");
    }
    if (!loading && data) {
      const fetchData = async () => {
        try {
          const response = await acceptProjectLink({
            variables: {
              link: router.query.id as string,
              projectId: router.query.project as string
            }
          });
          if (response && response.data) {
            router.push({ pathname: "/" });
          }
        } catch (err) {
          err.graphQLErrors
            ? message.error(err.graphQLErrors[0].message, 2.5)
            : message.error("An unknown error has occurred", 2);
        }
      };
      fetchData();
    }

    return () => {
      didCancel = true;
    };
  }, [data]);

  const handleSignup = () => {
    router.push({
      pathname: "/register"
    })
  }

  const handleLogin = () => {
    router.push({
      pathname: "/login",
      query: {
        returnUrl: "/invite/project/public",
        ...router.query
      }
    })
  }

  if (!loading && !data) {
    return <AnonLayout handleSignup={handleSignup} handleLogin={handleLogin} />;
  }

  return (
    <Layout hide={1}>
      <></>
    </Layout>
  );
};

export default PublicProjectInvitePage;

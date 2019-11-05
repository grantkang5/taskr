import React, { useEffect } from "react";
import Layout from "../../../components/layouts/Layout";
import { useRouter } from "next/router";
import {
  useMeQuery,
  useAcceptProjectInviteLinkMutation
} from "../../../generated/graphql";
import { message } from "antd";
import AnonLayout from "../../../components/layouts/AnonLayout";

const ProjectInviteSuccessPage: React.FC = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();
  const [acceptProjectInviteLink] = useAcceptProjectInviteLinkMutation();

  useEffect(() => {
    let didCancel = false;
    if (!router.query.id || !router.query.email) {
      router.push("/error", "/");
    }

    if (!loading && data) {
      const fetchData = async () => {
        const { id, email } = router.query;
        try {
          const response = await acceptProjectInviteLink({
            variables: {
              email: email as string,
              projectInviteLink: id as string
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
      pathname: "/register",
      query: {
        returnUrl: "/invite/project/success",
        registerKey: "project-invite",
        ...router.query
      }
    })
  }

  const handleLogin = () => {
    router.push({
      pathname: "/login",
      query: {
        returnUrl: "/invite/project/success",
        registerKey: "project-invite",
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

export default ProjectInviteSuccessPage;

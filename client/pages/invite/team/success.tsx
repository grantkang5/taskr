import React, { useEffect } from "react";
import styles from "./TeamInvite.module.less";
import Layout from "../../../components/layouts/Layout";
import {
  useMeQuery,
  useAcceptTeamInviteLinkMutation
} from "../../../generated/graphql";
import { message } from "antd";
import { useRouter } from "next/router";
import AnonLayout from "../../../components/layouts/AnonLayout";

/**
 * @route '/invite/team/success
 * @routeQuery { email: string, id: string }
 */

const TeamInviteSuccessPage: React.FC = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();
  const [acceptTeamInviteLink] = useAcceptTeamInviteLinkMutation();

  useEffect(() => {
    let didCancel = false;
    if (!router.query.id || !router.query.email) {
      router.push("/error", "/");
    }
    if (!loading && data) {
      const fetchData = async () => {
        const { id, email } = router.query;
        try {
          const response = await acceptTeamInviteLink({
            variables: {
              email: email as string,
              teamInviteLink: id as string
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

      return () => {
        didCancel = true;
      };
    }
  }, [data]);

  const handleSignup = () => {
    router.push({
      pathname: "/register",
      query: {
        returnUrl: "/invite/team/success",
        registerKey: "team-invite",
        ...router.query
      }
    });
  };

  const handleLogin = () => {
    router.push({
      pathname: "/login",
      query: {
        returnUrl: "/invite/team/success",
        registerKey: "team-invite",
        ...router.query
      }
    });
  };

  if (!loading && !data) {
    return <AnonLayout handleSignup={handleSignup} handleLogin={handleLogin} />;
  }

  return (
    <Layout hide={1}>
      <></>
    </Layout>
  );
};

export default TeamInviteSuccessPage;

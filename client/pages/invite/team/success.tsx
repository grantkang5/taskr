import React, { useEffect } from "react";
import styles from "./TeamInvite.module.less";
import Layout from "../../../components/layouts/Layout";
import {
  useMeQuery,
  useAcceptTeamInviteLinkMutation,
  useValidateLinkQuery
} from "../../../generated/graphql";
import { useRouter } from "next/router";
import AnonLayout from "../../../components/layouts/AnonLayout";
import { errorMessage } from "../../../lib/messageHandler";
import ErrorLayout from "../../../components/layouts/ErrorLayout";

/**
 * @route '/invite/team/success
 * @routeQuery { email: string, id: string }
 */

const TeamInviteSuccessPage: React.FC = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();
  const { data: validated, loading: validateLoading } = useValidateLinkQuery({
    variables: {
      key: `team-invite-${router.query.email}`,
      link: router.query.id as string
    },
    onError: err => {
      errorMessage(err);
    }
  });
  const [acceptTeamInviteLink] = useAcceptTeamInviteLinkMutation();

  useEffect(() => {
    let didCancel = false;
    if (!router.query.id || !router.query.email) {
      router.push("/error", "/");
    }

    if (!loading && data && validated && !validateLoading) {
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
          errorMessage(err);
        }
      };

      fetchData();

      return () => {
        didCancel = true;
      };
    }
  }, [data, validated]);

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

  if (!validated && !validateLoading) {
    return (
      <ErrorLayout message={"This link has expired or has already been used"} />
    );
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

export default TeamInviteSuccessPage;

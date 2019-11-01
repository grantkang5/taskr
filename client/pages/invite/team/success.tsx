import React, { useEffect } from "react";
import Layout from "../../../components/layouts/Layout";
import {
  useMeQuery,
  useAcceptTeamInviteLinkMutation
} from "../../../generated/graphql";
import { HeaderText, SubText } from "../../../components/common/Text";
import { Row, Col, Button, message } from "antd";
import { useRouter } from "next/router";

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
        id: router.query.id as string,
        email: router.query.email as string
      }
    });
  };

  const handleLogin = () => {
    router.push({
      pathname: "/login",
      query: {
        ...router.query,
        returnUrl: "/invite/team/success"
      }
    });
  };

  if (!loading && !data) {
    console.log(router);
    return (
      <Layout hide={1}>
        <HeaderText>
          Looks like you're not logged into your Taskr account.
        </HeaderText>
        <SubText>
          You must be logged into your Taskr account to accept the invitation.
        </SubText>

        <Row>
          <Col span={8}>
            <Button type="primary" onClick={handleSignup}>
              Sign up
            </Button>
          </Col>

          <Col span={8}>
            <Button onClick={handleLogin}>Log in</Button>
          </Col>
        </Row>
      </Layout>
    );
  }

  return (
    <Layout hide={1}>
      <></>
    </Layout>
  );
};

export default TeamInviteSuccessPage;

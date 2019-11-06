import React, { useEffect } from "react";
import Layout from "../../../components/layouts/Layout";
import { useRouter } from "next/router";
import {
  useMeQuery,
  useAcceptProjectInviteLinkMutation,
  useValidateLinkQuery
} from "../../../generated/graphql";
import AnonLayout from "../../../components/layouts/AnonLayout";
import ErrorLayout from "../../../components/layouts/ErrorLayout";
import { errorMessage } from "../../../lib/messageHandler";

const ProjectInviteSuccessPage: React.FC = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();
  const { data: validated, loading: validateLoading } = useValidateLinkQuery({
    variables: {
      key: `project-invite-${router.query.email}`,
      link: router.query.id as string
    },
    onError: err => {
      errorMessage(err)
    }
  });
  const [acceptProjectInviteLink] = useAcceptProjectInviteLinkMutation({
    variables: {
      email: router.query.email as string,
      projectInviteLink: router.query.id as string
    },
    onCompleted: () => router.push({ pathname: "/" }),
    onError: (err) => errorMessage(err)
  });

  useEffect(() => {
    let didCancel = false;
    if (!router.query.id || !router.query.email) {
      router.push("/error", "/");
    }

    if (!loading && data && validated && !validateLoading) {
      const fetchData = async () => {
        await acceptProjectInviteLink();
      };
      fetchData();
    }

    return () => {
      didCancel = true;
    };
  }, [data, validated]);

  const handleSignup = () => {
    router.push({
      pathname: "/register",
      query: {
        returnUrl: "/invite/project/success",
        registerKey: "project-invite",
        ...router.query
      }
    });
  };

  const handleLogin = () => {
    router.push({
      pathname: "/login",
      query: {
        returnUrl: "/invite/project/success",
        registerKey: "project-invite",
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

export default ProjectInviteSuccessPage;

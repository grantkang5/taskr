import React, { useEffect } from "react";
import Layout from "../../../components/layouts/Layout";
import { useRouter } from "next/router";
import {
  useMeQuery,
  useAcceptPublicProjectLinkMutation,
  useValidatePublicProjectLinkQuery
} from "../../../generated/graphql";
import AnonLayout from "../../../components/layouts/AnonLayout";
import { errorMessage } from "../../../lib/messageHandler";
import ErrorLayout from "../../../components/layouts/ErrorLayout";

const PublicProjectInvitePage: React.FC = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();
  const { data: validated, loading: validateLoading } = useValidatePublicProjectLinkQuery({
    variables: {
      projectId: router.query.project as string,
      link: router.query.id as string
    },
    onError: (err) => {
      errorMessage(err)
    }
  });
  const [acceptProjectLink] = useAcceptPublicProjectLinkMutation();

  useEffect(() => {
    let didCancel = false;
    if (!router.query.project || !router.query.id) {
      router.push("/error", "/");
    }
    if (!loading && data && validated && !validateLoading) {
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
          errorMessage(err)
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

  if (!validated && !validateLoading) {
    return <ErrorLayout message={"This link has expired, ask for a new one :D"} />
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

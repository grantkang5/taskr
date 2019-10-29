import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  useRegisterMutation,
  useResendVerificationLinkMutation,
  useMeLazyQuery
} from "../../generated/graphql";
import { setAccessToken } from "../../lib/accessToken";
import { message, Button, Icon } from "antd";
import Layout from "../../components/layouts/Layout";
import ErrorLayout from "../../components/layouts/ErrorLayout";

const EmailVerificationSuccessPage: React.FC = () => {
  const router = useRouter();
  const [
    register,
    { error: registerError, loading: registerLoading, called: registerCalled }
  ] = useRegisterMutation();
  const [resendVerificationLink] = useResendVerificationLinkMutation();
  const [getMe] = useMeLazyQuery();
  const resendVerificationEmail = async () => {
    try {
      const response = await resendVerificationLink({
        variables: {
          email: router.query.email as string
        }
      });
      await message.destroy();
      if (response && response.data) {
        router.push({
          pathname: "/email-verification",
          query: {
            email: router.query.email,
            id: response.data.resendVerificationLink
          }
        });
      }
    } catch (err) {
      err.graphQLErrors
        ? message.error(err.graphQLErrors[0].message, 2)
        : message.error(err.message, 2);
    }
  };

  useEffect(() => {
    let didCancel = false;
    if (!router.query.id || !router.query.email) {
      router.push("/error", "/");
    }

    const fetchData = async () => {
      const { id, email } = router.query;
      try {
        const response = await register({
          variables: {
            email: email as string,
            verificationLink: id as string
          }
        });

        setAccessToken(response.data!.register.accessToken);
        await getMe();
        message.success(`Congratulations! Welcome to Taskr`, 2.5);
        router.push({
          pathname: "/"
        });
      } catch (err) {
        message.warning(
          <span>
            <span>
              The validation link you used has expired or is no longer valid.
            </span>
            <Button type="link" onClick={resendVerificationEmail}>
              Resend verification link
            </Button>
            <Icon
              type="close-circle"
              style={{ cursor: "pointer" }}
              onClick={() => message.destroy()}
            />
          </span>,
          0
        );
        router.push("/");
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, []);

  if (registerError) {
    return <ErrorLayout />;
  }
  return (
    <Layout hide={1}>
      <></>
    </Layout>
  );
};

export default EmailVerificationSuccessPage;

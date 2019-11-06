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
import { errorMessage } from "../../lib/messageHandler";

const EmailVerificationSuccessPage: React.FC = () => {
  const router = useRouter();
  const [
    register,
    { error: registerError, loading: registerLoading, called: registerCalled }
  ] = useRegisterMutation({
    variables: {
      email: router.query.email as string,
      verificationLink: router.query.id as string
    },
    onCompleted: data => {
      setAccessToken(data.register.accessToken);
      getMe();
    },
    onError: err => {
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
  });
  const [resendVerificationLink] = useResendVerificationLinkMutation({
    variables: {
      email: router.query.email as string
    },
    onCompleted: data => {
      router.push({
        pathname: "/email-verification",
        query: {
          email: router.query.email,
          id: data.resendVerificationLink
        }
      });
    },
    onError: err => errorMessage(err)
  });
  const [getMe] = useMeLazyQuery({
    onCompleted: () => {
      message.success(`Congratulations! Welcome to Taskr`, 2.5);
      router.push({ pathname: "/" });
    }
  });

  const resendVerificationEmail = async () => {
    await resendVerificationLink();
    await message.destroy();
  };

  useEffect(() => {
    let didCancel = false;
    if (!router.query.id || !router.query.email) {
      router.push("/error", "/");
    }

    const fetchData = async () => {
      await register();
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

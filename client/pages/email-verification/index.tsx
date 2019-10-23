import React, { useEffect } from "react";
import Layout from "../../components/common/Layout";
import { HeaderText, SubText } from "../../components/common/Text";
import { Button, message } from "antd";
import { useRouter } from "next/router";
import { useResendVerificationLinkMutation } from "../../generated/graphql";

const EmailVerificationPage = () => {
  const router = useRouter();
  const [resendVerificationLink] = useResendVerificationLinkMutation()
  const resendVerificationEmail = async () => {
    try {
      const response = await resendVerificationLink({
        variables: {
          email: router.query.email as string
        }
      });
      if (response && response.data) {
        router.push({
          pathname: '/email-verification',
          query: { email: router.query.email, verificationLink: response.data.resendVerificationLink }
        });
      }
    } catch (err) {
      err.graphQLErrors
        ? message.error(err.graphQLErrors[0].message, 2)
        : message.error(err.message, 2);
    }
  }

  useEffect(() => {
    if (!router.query.verificationLink || !router.query.email) {
      router.push('/error', '/')
    }
  }, [])

  return (
    <Layout>
      <HeaderText>
        A verification link has been sent to {router.query.email}
      </HeaderText>
      <SubText>Your verification link will be valid for 1 hour.</SubText>
      <SubText>
        You will not be able to login until you verify your account.
      </SubText>
      <Button type="link" onClick={resendVerificationEmail}>
        Resend verification email
      </Button>
    </Layout>
  );
};

export default EmailVerificationPage;

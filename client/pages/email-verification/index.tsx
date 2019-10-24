import React, { useEffect } from "react";
import Layout from "../../components/common/Layout";
import { SubText } from "../../components/common/Text";
import { Button, message, PageHeader, Empty } from "antd";
import { useRouter } from "next/router";
import { useResendVerificationLinkMutation } from "../../generated/graphql";

const EmailVerificationPage = () => {
  const router = useRouter();
  const [resendVerificationLink] = useResendVerificationLinkMutation();
  const resendVerificationEmail = async () => {
    try {
      const response = await resendVerificationLink({
        variables: {
          email: router.query.email as string
        }
      });
      if (response && response.data) {
        router.push({
          pathname: "/email-verification",
          query: {
            email: router.query.email,
            verificationLink: response.data.resendVerificationLink
          }
        });
        message.success('Email verification sent', 2)
      }
    } catch (err) {
      err.graphQLErrors
        ? message.error(err.graphQLErrors[0].message, 2)
        : message.error(err.message, 2);
    }
  };

  useEffect(() => {
    if (!router.query.verificationLink || !router.query.email) {
      router.push("/error", "/");
    }
  }, []);

  const goBack = () => router.back();

  return (
    <Layout hide={1}>
      <PageHeader title="Thanks for signing up to Taskr" onBack={goBack}>
        <SubText>
          Click on the verification link from your email to confirm your
          verification.
        </SubText>
        <SubText>
          The verification link will be valid for 1 hour. If you did not receive
          one, click on the verification link below.
        </SubText>
      </PageHeader>

      <Empty
        image="/static/email/4x/mobile-chat@4x.png"
        imageStyle={{
          marginTop: "60px"
        }}
        description={
          <span>
            An email has been sent to <b>{router.query.email}</b> verify your
            account.
          </span>
        }
      >
        <Button type="link" onClick={resendVerificationEmail}>Resend verification link</Button>
      </Empty>
    </Layout>
  );
};

export default EmailVerificationPage;

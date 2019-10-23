import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useRegisterMutation, useResendVerificationLinkMutation } from "../../generated/graphql";
import { setAccessToken } from "../../lib/accessToken";
import { message, Button } from "antd";

const EmailVerificationSuccessPage: React.FC = () => {
  const router = useRouter();
  const [register, { error }] = useRegisterMutation();
  const [resendVerificationLink, { loading }] = useResendVerificationLinkMutation()

  const resendVerificationEmail = async () => {
    try {
      const response = await resendVerificationLink({
        variables: {
          email: router.query.email as string
        }
      });
      message.destroy();
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
      router.push("/error", "/");
    }

    const fetchData = async () => {
      const { verificationLink, email } = router.query;
      const response = await register({
        variables: {
          email: email as string,
          verificationLink: verificationLink as string
        }
      });
      if (response && response.data) {
        setAccessToken(response.data.register.accessToken);
        message.success(`Congratulations! Welcome to Taskr`, 2.5);
        router.push("/");
      }
    };

    fetchData();
  }, []);

  if (error) {
    message.warning(
      <span>
        <span>
          The validation link you used has expired or is no longer valid.
        </span>
        <Button type="link" onClick={resendVerificationEmail}>Resend verification link</Button>
      </span>,
      0
    );
    router.push("/");
  }

  return <></>;
};

export default EmailVerificationSuccessPage;

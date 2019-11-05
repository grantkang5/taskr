import React, { useEffect } from "react";
import { Button } from "antd";
import { useLoginGoogleOAuthLazyQuery } from "../../generated/graphql";
import { useRouter } from "next/router";

const GoogleLogin: React.FC = () => {
  const router = useRouter();
  const [
    useGoogleURL,
    { data, called, error, loading }
  ] = useLoginGoogleOAuthLazyQuery()

  useEffect(() => {
    if (called && !error && !loading && data && data.loginGoogleOAuth) {
      window.location.href = data.loginGoogleOAuth
    }
  }, [data]);

  const handleGoogleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await useGoogleURL({
      variables: {
        returnUrl: JSON.stringify(router.query)
      }
    });
  };

  return (
    <Button onClick={handleGoogleLogin} icon="google" style={{ width: "100%" }}>
      Sign in with Google
    </Button>
  );
};

export default GoogleLogin;

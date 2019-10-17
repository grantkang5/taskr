import React, { useEffect } from "react";
import { Button } from 'antd'
import { useGoogle_OAuthLazyQuery } from "../../generated/graphql";

const GoogleLogin: React.FC = () => {
  const [
    useGoogleURL,
    { data, called, error, loading }
  ] = useGoogle_OAuthLazyQuery();

  useEffect(() => {
    if (called && !error && !loading && data && data.login_googleOAuth) {
      window.location.href = data.login_googleOAuth;
    }
  }, [data]);

  const handleGoogleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await useGoogleURL();
  };

  return (
    <Button onClick={handleGoogleLogin} icon="google" style={{ width: "100%" }}>
      Sign in with Google
    </Button>
  );
};

export default GoogleLogin;

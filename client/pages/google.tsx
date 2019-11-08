import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { setAccessToken } from "../lib/accessToken";
import { useAuth_GoogleOAuthMutation } from "../generated/graphql";

const GoogleOAuth: React.FC = () => {
  const router = useRouter();
  const { code, state }: { code?: string; state?: string } = router.query;
  const [auth] = useAuth_GoogleOAuthMutation({
    onCompleted: data => {
      setAccessToken(data.auth_googleOAuth.accessToken);
      if (state && Object.keys(JSON.parse(state)).length) {
        const routeQuery = JSON.parse(router.query.state as string);
        const { returnUrl, ...queryParams } = routeQuery;
        router.push({
          pathname: returnUrl,
          query: {
            ...queryParams
          }
        });
      } else {
        window.location.href = process.env.CLIENT_URL!;
      }
    }
  });
  
  useEffect(() => {
    if (code) {
      const fetchGoogleUser = async () => {
        auth({
          variables: { code }
        });
      };
      fetchGoogleUser();
    }
  }, []);
  return <></>;
};

export default GoogleOAuth;

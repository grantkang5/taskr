import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { setAccessToken } from "../lib/accessToken";
import { useAuth_GoogleOAuthMutation } from "../generated/graphql";

const GoogleOAuth: React.FC = () => {
  const [auth] = useAuth_GoogleOAuthMutation();
  const router = useRouter();
  console.log(router);
  useEffect(() => {
    const { code, state }: { code?: string; state?: string } = router.query;

    if (code) {
      const fetchGoogleUser = async () => {
        const response = await auth({
          variables: { code }
        });

        if (response && response.data) {
          setAccessToken(response.data.auth_googleOAuth.accessToken);
          if (state) {
            const routeQuery = JSON.parse(router.query.state as string)
            const { returnUrl, ...queryParams } = routeQuery
            router.push({
              pathname: returnUrl,
              query: {
                ...queryParams
              }
            })
          } else {
            window.location.href = process.env.CLIENT_URL!;
          }
        }
      };
      fetchGoogleUser();
    }
  }, []);
  return <></>;
};

export default GoogleOAuth;

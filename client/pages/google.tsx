import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setAccessToken } from '../lib/accessToken';
import { useAuth_GoogleOAuthMutation } from '../generated/graphql';

const GoogleOAuth: React.FC = () => {
  const [auth] = useAuth_GoogleOAuthMutation();
  const router = useRouter()

  useEffect(() => {
    const { code }: { code?: string } = router.query;
    if (code) {
      const fetchGoogleUser = async () => {
        const response = await auth({
          variables: { code }
        });

        if (response && response.data) {
          setAccessToken(response.data.auth_googleOAuth.accessToken);
          window.location.href = process.env.CLIENT_URL!;
        }
      };
      fetchGoogleUser();
    }
  }, []);
  return <></>;
};

export default GoogleOAuth;

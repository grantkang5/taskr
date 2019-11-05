import React, { useEffect } from 'react';
import Layout from '../../../components/layouts/Layout';
import { useRouter } from 'next/router';
import { useMeQuery, useAcceptPublicProjectLinkMutation } from '../../../generated/graphql';
import { message } from 'antd';

const PublicProjectInvitePage: React.FC = () => {
  const router = useRouter(); 
  const { data, loading } = useMeQuery();
  const [acceptProjectLink] = useAcceptPublicProjectLinkMutation();

  useEffect(() => {
    if (!router.query.project || !router.query.id) {
      router.push("/error", "/")
    }
    if (!loading && data) {
      const fetchData = async () => {
        try {
          const response = await acceptProjectLink({
            variables: {
              link: router.query.id as string,
              projectId: router.query.project as string
            }
          })
        } catch (err) {
          err.graphQLErrors
            ? message.error(err.graphQLErrors[0].message, 2.5)
            : message.error("An unknown error has occurred", 2);
        }
      }
    }
  }, [])

  return (
    <Layout hide={1}><></></Layout>
  )
}

export default PublicProjectInvitePage;
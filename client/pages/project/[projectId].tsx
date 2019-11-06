import React from 'react';
import Layout from '../../components/layouts/Layout';
import { useRouter } from 'next/router';

const ProjectPage: React.FC = () => {
  const router = useRouter()
  console.log(router.query)

  return (
    <Layout>
      Project page
    </Layout>
  )
}

export default ProjectPage;
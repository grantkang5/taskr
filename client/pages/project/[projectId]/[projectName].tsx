import React from 'react';
import Layout from '../../../components/layouts/Layout';

/**
 * Route: '/project/:projectId/:projectName'
 * Api: Query project and all associated lists, cards, and users
 * Render: All lists that belong to project, all cards within the lists
 * Render all Users associated with the project
 */

const ProjectPage: React.FC = () => {
  return (
    <Layout>
      Project Page
    </Layout>
  )
}

export default ProjectPage;
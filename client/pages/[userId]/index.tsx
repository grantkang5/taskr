import React from 'react';
import Layout from '../../components/layouts/Layout';

/**
 * Route: '/user' ie. '/grantkang'
 * Api: Query User api which will include Activity / Projects / Cards
 * Render: Recent activity from user, projects that user belongs to, and Cards that user is assigned to
 * Render2: If userId from route (router.query.userId) is equal to currentUser also render
 * additional settings/profile management forms
 */


const UserPage = () => {
  return (
    <Layout>
      User Page
    </Layout>
  )
}

export default UserPage 
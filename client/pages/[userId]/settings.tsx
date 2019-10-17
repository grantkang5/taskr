import React from 'react';
import Layout from '../../components/common/Layout';

/**
 * Protected: This page should only be allowed from current user's page
 * Check path to see if userId query matches current User.
 * If not, redirect to current users setting page
 * ie. '/stranger/settings' --NOT ME,, REDIRECT --> '/grantkang/settings'
 */

const SettingsPage: React.FC = () => {
  return (
    <Layout>
      Settings Page
    </Layout>
  )
}

export default SettingsPage;
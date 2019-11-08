import React from "react";
import Layout from "../components/layouts/Layout";
import { Menu, Icon, Skeleton } from "antd";

import "./App.less";
import { MenuItemIcon } from "../components/common/Menu";
import { useModal } from "../components/modals";
import { useGetUserTeamsQuery, useGetUserProjectsQuery } from "../generated/graphql";
import DashboardLayout from "../components/layouts/DashboardLayout";
import DashboardProjects from "../components/layouts/DashboardLayout/DashboardProjects";
/**
 * Route: '/'
 * Api: Query currentUser's projects / Activity / Cards
 */

const Dashboard = () => {
  const { data, loading } = useGetUserProjectsQuery();
  return (
    <DashboardLayout>
       {
        !loading && data && data.getUserProjects ? (
          <DashboardProjects />
        ) : <Skeleton active />
      }
    </DashboardLayout>
  )
};

export default Dashboard;
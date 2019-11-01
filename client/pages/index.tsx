import React from "react";
import Layout from "../components/layouts/Layout";
import { Menu, Icon, Skeleton } from "antd";

import "./App.module.less";
import { MenuItemIcon } from "../components/common/Menu";
import { useModal } from "../components/modals";
import { useGetUserTeamsQuery } from "../generated/graphql";
import DashboardLayout from "../components/layouts/DashboardLayout";
/**
 * Route: '/'
 * Api: Query currentUser's projects / Activity / Cards
 */

const Dashboard = () => {
  return (
    <DashboardLayout />
  )
};

export default Dashboard;

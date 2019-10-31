import React from "react";
import Layout from "../components/layouts/Layout";
import { Menu, Icon, Skeleton } from "antd";

import "./App.module.less";
import { MenuItemIcon } from "../components/common/Menu";
import { useModal } from "../components/modals";
import { useGetUserTeamsQuery } from "../generated/graphql";
/**
 * Route: '/'
 * Api: Query currentUser's projects / Activity / Cards
 */

const Dashboard = () => {
  const { showModal } = useModal();
  const { data, loading } = useGetUserTeamsQuery();

  const showCreateTeamModal = () => showModal("createTeam");
  return (
    <Layout
      sider={
        <>
          <Menu
            style={{ height: "100%" }}
            mode="inline"
            defaultOpenKeys={["projects", "teams"]}
          >
            <Menu.SubMenu
              key="projects"
              title={
                <span>
                  <Icon type="project" />
                  <span>Projects</span>
                </span>
              }
            >
              <Menu.Item>
                <Icon type="project" /> Project 1
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              key="teams"
              title={
                <span>
                  <Icon type="team" />
                  <span>Teams</span>
                </span>
              }
            >
              {loading || !data ? (
                <Skeleton active />
              ) : (
                data.getUserTeams.map(team => (
                  <Menu.Item key={team.id}>{team.name}</Menu.Item>
                ))
              )}
            </Menu.SubMenu>
            <Menu.Divider />
            <Menu selectable={false} style={{ borderRight: 'none', paddingTop: '20px' }}>
              <MenuItemIcon
                label="Create Project"
                iconType="plus-square"
                leftIcon="project"
              />
              <MenuItemIcon
                label="Create Team"
                iconType="plus-square"
                leftIcon="team"
                onClick={showCreateTeamModal}
              />
            </Menu>
          </Menu>
        </>
      }
    >
      <div />
    </Layout>
  );
};

export default Dashboard;

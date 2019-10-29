import React from "react";
import Layout from "../components/layouts/Layout";
import { Menu, Icon } from "antd";

import "./App.module.less";
/**
 * Route: '/'
 * Api: Query currentUser's projects / Activity / Cards
 */

const Dashboard = () => {
  return (
    <Layout
      sider={
        <>
          <Menu style={{ height: "100%" }} mode="inline">
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
                Project 1
              </Menu.Item>
              <Menu.Item>
                Project 2
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
              <Menu.Item>
                Team 1
              </Menu.Item>
              <Menu.Item>
                Team 2
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </>
      }
    >
      <div />
    </Layout>
  );
};

export default Dashboard;

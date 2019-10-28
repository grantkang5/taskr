import React, { useEffect } from "react";
import { Layout as AntdLayout, Menu } from "antd";
import { useRouter } from "next/router";
import Layout from "../Layout";
const { Sider } = AntdLayout;

const SettingsLayout: React.FC = ({ children }) => {
  const router = useRouter();

  return (
    <Layout
      sider={
        <>
          <Menu style={{ height: '100%' }}>
            <Menu.Item>User settings</Menu.Item>
          </Menu>
        </>
      }
    >
      {children}
    </Layout>
  );
};

export default SettingsLayout;

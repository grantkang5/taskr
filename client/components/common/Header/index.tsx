import React from "react";
import { useMeQuery, useLogoutMutation } from "../../../generated/graphql";
import classNames from "classnames";
import { Layout, Row, Col, Avatar, Dropdown, Menu, Icon } from "antd";
import styles from "./Header.module.less";
import { ButtonLink } from "../Button";
import AnonHeader from "./AnonHeader";
import { useRouter } from "next/router";
import { setAccessToken } from "../../../lib/accessToken";

interface Props {
  dark?: number;
}

export const Header: React.FC<Props> = ({ dark }) => {
  const router = useRouter();
  const { data } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  const headerStyle = classNames(styles.header, {
    [styles.dark]: dark
  });

  if (!data || !data.me) {
    return <AnonHeader dark={dark} />;
  }

  const handleMenuClick = async ({ key }: { key: string }) => {
    switch(key) {
      case "settings": {
        router.push('/settings')
        break;
      }
      case "logout": {
        const logoutResponse = await logout();
        if (logoutResponse) {
          setAccessToken('');
          await client!.resetStore();
          router.push('/login')
          break;
        }
      }

      default:
        return;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item disabled>
        {data.me.username} ({data.me.email})
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="settings">
        <Icon type="setting" />
        <span>
          Settings  
        </span>
      </Menu.Item>
      <Menu.Item key="logout">
        <Icon type="logout" />
        <span>Log out</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header className={headerStyle}>
      <Row>
        <Col span={8}>
          <Row>
            <Col span={4}>
              <ButtonLink path="/">Home</ButtonLink>
            </Col>
          </Row>
        </Col>
        <Col span={16}>
          <Row type="flex" justify="end">
            <Col span={3}>
              <Dropdown overlay={menu} placement="bottomRight">
                <Avatar icon="user" alt="user" />
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  );
};

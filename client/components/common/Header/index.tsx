import React from "react";
import { useMeQuery } from "../../../generated/graphql";
import classNames from "classnames";
import { Layout, Row, Col, Avatar, Dropdown, Menu, Button } from "antd";
import { Logout } from "../../auth/Logout";
import styles from "./Header.module.less";
import { ButtonLink } from "../Button";
import AnonHeader from "./AnonHeader";

interface Props {
  dark?: number;
}

export const Header: React.FC<Props> = ({ dark }) => {
  const { data } = useMeQuery();

  const headerStyle = classNames(styles.header, {
    [styles.dark]: dark
  });

  if (!data || !data.me) {
    return <AnonHeader dark={dark} />
  }

  const menu = (
    <Menu >
      <Menu.Item disabled>
        {data.me.email}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Logout>
          Log Out
        </Logout>
      </Menu.Item>
    </Menu>
  )

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



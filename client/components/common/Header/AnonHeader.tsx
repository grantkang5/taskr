import React from "react";
import { Layout, Row, Col, Button } from "antd";
import Link from "next/link";
import classNames from "classnames";

import styles from "./Header.module.less";

interface Props {
  dark?: number;
}

const AnonHeader: React.FC<Props> = ({ dark }) => {
  const headerStyle = classNames(styles.header, {
    [styles.dark]: dark
  });
  return (
    <Layout.Header className={headerStyle}>
      <Row>
        <Col span={8}>
          <Row>
            <Col span={4}>
              <Link href="/home" as="/home">
                <Button type="link" ghost={dark ? true : false}>
                  Home
                </Button>
              </Link>
            </Col>
          </Row>
        </Col>
        <Col span={16}>
          <Row type="flex" justify="end">
            <Col span={3}>
              <Link href="/login" as="/login">
                <Button type="link" ghost={dark ? true : false}>
                  Login
                </Button>
              </Link>
            </Col>
            <Col span={3}>
              <Link href="/register" as="/register">
                <Button type="link" ghost={dark ? true : false}>
                  Signup
                </Button>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  );
};

export default AnonHeader;

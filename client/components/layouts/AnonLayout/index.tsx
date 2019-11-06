import React from "react";
import styles from "./AnonLayout.module.less";
import { Button } from "antd";
import { HeaderText, SubText } from "../../common/Text";
import Layout from "../Layout";

interface Props {
  handleSignup: () => void;
  handleLogin: () => void;
}

const AnonLayout: React.FC<Props> = ({ handleSignup, handleLogin }) => {
  return (
    <Layout hide={1}>
      <div className={styles.container}>
        <HeaderText>
          Looks like you're not logged into your Taskr account.
        </HeaderText>
        <SubText>
          You must be logged into your Taskr account to accept the invitation.
        </SubText>

        <div className={styles.buttonContainer}>
          <Button type="primary" onClick={handleSignup} size="large">
            Sign up
          </Button>

          <Button onClick={handleLogin} size="large">
            Log in
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AnonLayout;

import React from "react";
import { useMeQuery } from "../../../generated/graphql";
import Link from "next/link";
import { Button } from "antd";
import { Logout } from "../../auth/Logout";
import styles from "./Header.module.less";

export const Header: React.FC = () => {
  const { data, loading } = useMeQuery();

  if (!data || !data.me) {
    return (
      <header className={styles.header}>
        <div className={styles.left}>
          <Link href="/">
            <a>Home</a>
          </Link>
        </div>
        <div className={styles.right}>
          <Link href="/login">
            <a>Log In</a>
          </Link>

          <Link href="/register">
            <a className={styles.blueLink}>Sign Up</a>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </div>

      <div className={styles.right}>
        <Logout />
      </div>
    </header>
  );
};

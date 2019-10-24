import * as React from "react";
import Head from "next/head";
import { Header } from "../Header";
import styles from "./Layout.module.less";
import classNames from "classnames";
import { Layout as AntdLayout } from "antd";

type Props = {
  title?: string;
  hide?: number;
  dark?: number;
};

const Layout: React.FC<Props> = ({
  children,
  hide,
  dark,
  title = "Taskr"
}) => {
  const layoutStyle = classNames(styles.layout, {
    [styles.dark]: dark
  });

  return (
    <AntdLayout className={layoutStyle}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {process.env.NODE_ENV !== 'production' && (
            <link rel="stylesheet" type="text/css" href={'/_next/static/css/styles.chunk.css?v=' + Date.now()} />
          )}
      </Head>

      {!hide ? (
        <Header dark={dark} />
      ) : null}
      <AntdLayout.Content>{children}</AntdLayout.Content>
    </AntdLayout>
  );
};

export default Layout;

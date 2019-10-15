import * as React from "react";
import Head from "next/head";
import { Header } from "../Header";
import styles from "./Layout.module.less";
import classNames from 'classnames'

type Props = {
  title?: string;
  hide?: number;
  dark?: number;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  hide,
  dark,
  title = "This is the default title"
}) => {
  const layoutStyle = classNames(styles.layout, {
    [styles.dark]: dark
  })

  return (
    <div className={layoutStyle}>
      <style jsx global>
        {`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `}
      </style>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {!hide ? (
        <React.Fragment>
          <Header />
          <div className={styles.headerSpace} />
        </React.Fragment>
      ) : null}
      {children}
    </div>
  );
};

export default Layout;

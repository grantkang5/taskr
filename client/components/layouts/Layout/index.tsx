import * as React from 'react';
import Head from 'next/head';
import { Header } from '../../common/Header';
import styles from './Layout.module.less';
import classNames from 'classnames';
import { Layout as AntdLayout, Row, Col } from 'antd';

type Props = {
  title?: string;
  hide?: number;
  dark?: number;
  sider?: React.ReactNode;
};

/**
 *
 * @param {1 | 0} hide (Number) Hides the header if 1
 * @param {1 | 0} dark (Number) Makes layout background dark if 1
 * @param {React.ReactNode} sider (ReactNode) sider Enables sider element
 */

const Layout: React.FC<Props> = ({
  children,
  hide,
  dark,
  sider,
  title = 'Taskr'
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
      </Head>
      {!hide ? <Header dark={dark} /> : null}

      {sider ? (
        <div className={styles.layoutWithSider}>
          <Row type="flex" style={{ height: '100%' }}>
            <Col span={5}>
              <div className={styles.sider}>{sider}</div>
            </Col>

            <Col span={16}>
              <AntdLayout.Content style={{ paddingTop: '40px' }}>
                {children}
              </AntdLayout.Content>
            </Col>
          </Row>
        </div>
      ) : (
        <AntdLayout.Content>{children}</AntdLayout.Content>
      )}
    </AntdLayout>
  );
};

export default Layout;

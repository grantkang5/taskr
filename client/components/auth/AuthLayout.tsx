import React from 'react';

import styles from './Auth.module.less';
import { useRouter } from 'next/router';
import { HeaderText, SubText } from '../common/Text';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const authText: { [index: string]: any } = {
    '/login': {
      greeting: 'Log in to Taskr',
      alt: "Don't have an account?",
      altLink: 'Sign up',
      altHref: '/register'
    },
    '/register': {
      greeting: 'Sign up to Taskr',
      alt: 'Already have an account?',
      altLink: 'Log in',
      altHref: '/login'
    },
    '/forgot-password': {
      greeting: 'Forgot password',
      alt: "Go back to",
      altLink: 'Log in',
      altHref: '/login'
    },
    '/forgot-password/success': {
      greeting: 'Reset password',
      alt: "Go back to",
      altLink: 'Log in',
      altHref: '/login'
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.headerContainer}>
        <HeaderText white={1} style={{ marginBottom: '.5em' }}>
          {authText[router.route].greeting}
        </HeaderText>

        <div className={styles.highlight} />

        <div>
          <SubText white={1}>
            {authText[router.route].alt}{' '}
            <Link href={authText[router.route].altHref} as={authText[router.route].href}>
              <a>{authText[router.route].altLink}</a>
            </Link>
          </SubText>
        </div>
      </div>
      <div className={styles.formContainer}>{children}</div>
    </div>
  );
};

export default AuthLayout;

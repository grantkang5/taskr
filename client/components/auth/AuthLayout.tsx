import React from 'react';

import styles from './Auth.module.less'
import { useRouter } from 'next/router';
import { HeaderText, SubText } from '../common/Text';
import Link from 'next/link';


interface Props {
  children: React.ReactNode
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const authText: { [index: string]: any } = {
    "/login": { greeting: "Log in", alt: "Don't have an account?", altLink: "Sign up", href: "/register" },
    "/register": { greeting: "Sign up", alt: "Already have an account?", altLink: "Log in", href: "/login" }
  }

  return (
    <div className={styles.layout}>
      <div className={styles.headerContainer}>
        <HeaderText white={1} style={{ marginBottom: '.5em' }}>
          {authText[router.route].greeting} to Taskr
        </HeaderText>

        <div className={styles.highlight} />

        <div>
          <SubText white={1}>
            {authText[router.route].alt} {' '}
            <Link href={authText[router.route].href}>
              <a>
                {authText[router.route].altLink}
              </a>
            </Link>
          </SubText>
        </div>
      </div>
      <div className={styles.formContainer}>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout;
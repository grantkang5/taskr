import React from 'react';
import classNames from 'classnames';

import styles from './Text.module.less'

const textStyle = (mainStyle: string, props: any) => classNames(mainStyle, {
  [styles.white]: props.white
})

interface Props {
  children: React.ReactNode,
  white?: number,
  style?: object
}

export const Text:React.FC<Props> = ({ children, ...props }) => {
  return (
    <p className={textStyle(styles.text, props)} {...props}>{children}</p>
  )
}

export const HeaderText:React.FC<Props> = ({ children, ...props }) => {
  return (
    <p className={textStyle(styles.header, props)} {...props}>{children}</p>
  )
}

export const HeaderSubText:React.FC<Props> = ({ children, ...props }) => {
  return (
    <p className={textStyle(styles.headerSubText, props)} {...props}>{children}</p>
  )
}

export const SubText:React.FC<Props> = ({ children, ...props }) => {
  return (
    <p className={textStyle(styles.subText, props)} {...props}>{children}</p>
  )
}
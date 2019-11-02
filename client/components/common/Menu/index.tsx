import React from "react";
import { Menu, Icon } from "antd";
import styles from './IconItem.module.less'
import { MenuItemProps } from "antd/lib/menu/MenuItem";

const { Item } = Menu;

interface MenuItemIconProps {
  label: string;
  iconType: string;
  leftIcon?: string;
}

export const MenuItemIcon: React.FC<MenuItemIconProps & MenuItemProps> = ({
  label,
  leftIcon,
  iconType,
  ...props
}) => {
  return (
    <Item {...props} style={{ position: "relative" }}>
      <span className={styles.menuItemIcon}>
        {leftIcon && <Icon type={leftIcon} />}
        <span>{label}</span>
        <Icon type={iconType} className={styles.rightIcon} />
      </span>
    </Item>
  );
};

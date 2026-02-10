"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/shared/components/Button/Button";
import {
  avatar,
  notificationIcon,
  logoutIcon,
  settingsIcon,
  logoSfera,
} from "@/shared/components/Header/assets/";
import { MenuItem } from "@/shared/components/MenuItem/MenuItem";
import { MENU } from "@/shared/config/menu.config";

import styles from "./Header.module.scss";

import type { HeaderProps } from "./types";

export function Header(props: HeaderProps) {
  const { userName = "Иван Петров", userAvatar = avatar } = props;
  const pathname = usePathname();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logo}>
        <Image className={styles.logoPic} src={logoSfera} alt="Логотип"></Image>
      </div>

      <nav className={styles.navigationBlock}>
        {MENU.map((menuItem) => (
          <MenuItem
            className={styles.menuItem}
            key={menuItem.href}
            menuItem={menuItem}
            isActive={pathname === menuItem.href}
          />
        ))}
      </nav>

      <div className={styles.userContainer}>
        <Button className={styles.iconButton}>
          <Image className={styles.icon} src={notificationIcon} alt="Уведомления"></Image>
        </Button>
        <Button className={styles.iconButton}>
          <Image className={styles.icon} src={settingsIcon} alt="Настройки"></Image>
        </Button>
        <Image className={styles.avatar} src={userAvatar} alt="Аватар"></Image>
        <h2 className={styles.userName}>{userName}</h2>
        <Button className={styles.iconButton}>
          <Image className={styles.icon} src={logoutIcon} alt="Выйти из системы"></Image>
        </Button>
      </div>
    </header>
  );
}

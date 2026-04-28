"use client";

import { observer } from "mobx-react-lite";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { notificationIcon, logoutIcon } from "@/shared/assets";
import { Button } from "@/shared/components/Button/Button";
import { ExitPopup } from "@/shared/components/ExitPopup/ExitPopup";
import { MenuItem } from "@/shared/components/MenuItem/MenuItem";
import { PAGES } from "@/shared/config/pages.config";
import { getAppRoleFromSessionUser, getAvailableNav } from "@/shared/config/roles.config";
import { useStores } from "@/shared/store";

import { logoSfera } from "./assets/index";
import styles from "./Header.module.scss";

const HeaderView = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { auth } = useStores();
  const [showPopup, setShowPopup] = useState(false);

  const role = getAppRoleFromSessionUser(auth.currentUser);
  const visibleNav = getAvailableNav(role);
  const displayName = auth.currentUser?.name?.trim() ? auth.currentUser.name.trim() : "Без имени";

  const handleLogoutClick = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleConfirm = async () => {
    setShowPopup(false);
    await auth.logout();
    router.replace(PAGES.LOGIN);
  };

  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.logo}>
          <Image className={styles.logoPic} src={logoSfera} alt="Логотип"></Image>
        </div>

        {visibleNav.length > 0 ? (
          <nav className={styles.navigationBlock}>
            {visibleNav.map((menuItem) => (
              <MenuItem
                className={styles.menuItem}
                key={menuItem.href}
                menuItem={menuItem}
                isActive={pathname === menuItem.href}
              />
            ))}
          </nav>
        ) : null}

        {auth.isAuthorized ? (
          <div className={styles.userContainer}>
            <Button className={styles.iconButton}>
              <Image className={styles.icon} src={notificationIcon} alt="Уведомления"></Image>
            </Button>
            <p className={styles.userName}>{displayName}</p>
            <Button className={styles.iconButton} onClick={handleLogoutClick}>
              <Image className={styles.icon} src={logoutIcon} alt="Выйти из системы"></Image>
            </Button>
          </div>
        ) : null}
      </header>

      {showPopup && <ExitPopup onCancel={handleCancel} onConfirm={handleConfirm} />}
    </>
  );
};

export const Header = observer(HeaderView);

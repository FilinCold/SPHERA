import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import styles from "./MenuItem.module.scss";

import type { Props } from "./types";

export function MenuItem(props: Props) {
  const { menuItem, isActive, className } = props;

  return (
    <Link
      href={menuItem.href}
      className={clsx(styles.menuItem, className, isActive && styles.active)}
    >
      {menuItem.icon && <Image className={styles.icon} src={menuItem.icon} alt={menuItem.name} />}
      <span>{menuItem.name}</span>
    </Link>
  );
}

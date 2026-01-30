"use client";

import clsx from "clsx";

import styles from "./AdaptiveBlock.module.scss";

import type { AdaptiveBlockProps } from "./types";

export const AdaptiveBlock = ({ children, className }: AdaptiveBlockProps) => {
  const blockClassName = clsx(styles.adaptiveBlock, className);

  return <div className={blockClassName}>{children}</div>;
};

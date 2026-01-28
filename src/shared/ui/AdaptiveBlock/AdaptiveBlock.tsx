"use client";

import styles from "./AdaptiveBlock.module.scss";

import type { AdaptiveBlockProps } from "./types";

export const AdaptiveBlock: React.FC<AdaptiveBlockProps> = ({ children }) => {
  return <div className={styles.adaptiveBlock}>{children}</div>;
};

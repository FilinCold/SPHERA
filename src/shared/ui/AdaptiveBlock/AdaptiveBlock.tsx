"use client";

import type { AdaptiveBlockProps } from "./types";
import styles from "./AdaptiveBlock.module.scss";

export const AdaptiveBlock: React.FC<AdaptiveBlockProps> = ({ children }) => {
  return <div className={styles.adaptiveBlock}>{children}</div>;
};

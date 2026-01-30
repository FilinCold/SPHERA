"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect } from "react";

import crossIcon from "./assets/x-thin.svg";
import styles from "./Modal.module.scss";

import type { ModalProps } from "./types";

export const Modal = (props: ModalProps) => {
  const { children, className, isOpen, onClose } = props;
  const modalContentClassName = clsx(styles.modalContent, className);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <Image src={crossIcon} alt="Закрыть модальное окно" width={26} height={26} />
        </button>
        <div className={modalContentClassName}>{children}</div>
      </div>
    </div>
  );
};

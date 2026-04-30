"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect } from "react";

import crossIcon from "./assets/x-thin.svg";
import styles from "./Modal.module.scss";

import type { ModalProps } from "./types";

export const Modal = (props: ModalProps) => {
  const { children, className, hideCloseButton = false, isOpen, onClose, showCloseButton } = props;
  const shouldShowCloseButton =
    typeof showCloseButton === "boolean" ? showCloseButton : !hideCloseButton;
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

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose} />

      <div className={styles.modalContainer}>
        <div className={modalContentClassName}>
          {shouldShowCloseButton ? (
            <button type="button" className={styles.closeButton} onClick={onClose}>
              <Image src={crossIcon} alt="Закрыть модальное окно" width={26} height={26} />
            </button>
          ) : null}
          {children}
        </div>
      </div>
    </>
  );
};

"use client";

import dynamic from "next/dynamic";

import TitleBar from "@/shared/components/TitleBar/TitleBar";

import styles from "./page.module.scss";

const EditSpaceView = dynamic(() => import("./EditSpaceView").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <>
      <TitleBar />
      <p className={styles.loadingHint}>Загрузка…</p>
    </>
  ),
});

export function EditSpaceGate() {
  return <EditSpaceView />;
}

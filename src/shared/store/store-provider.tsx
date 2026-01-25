"use client";

import { createContext, type PropsWithChildren, useContext, useMemo } from "react";
import { enableStaticRendering } from "mobx-react-lite";

import { createRootStore, type RootStore } from "./root-store";

enableStaticRendering(typeof window === "undefined");

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const store = useMemo(() => createRootStore(), []);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStores = (): RootStore => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error("useStores must be used within a StoreProvider");
  }

  return store;
};

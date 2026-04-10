"use client";

import { StoreProvider } from "@/shared/store";

import type { PropsWithChildren } from "react";
import "../../src/shared/styles/globals.scss";

export const Providers = ({ children }: PropsWithChildren) => (
  <StoreProvider>{children}</StoreProvider>
);

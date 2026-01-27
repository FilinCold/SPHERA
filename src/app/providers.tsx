"use client";

import { StoreProvider } from "@/shared/store";

import type { PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren) => (
  <StoreProvider>{children}</StoreProvider>
);

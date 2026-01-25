"use client";

import type { PropsWithChildren } from "react";

import { StoreProvider } from "@/shared/store";

export const Providers = ({ children }: PropsWithChildren) => (
  <StoreProvider>{children}</StoreProvider>
);

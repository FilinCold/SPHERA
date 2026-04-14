"use client";

import { StoreProvider } from "@/shared/store";
import { AuthGuard } from "@/widgets/AuthGuard/AuthGuard";

import type { PropsWithChildren } from "react";
import "../../src/shared/styles/globals.scss";

export const Providers = ({ children }: PropsWithChildren) => (
  <StoreProvider>
    <AuthGuard>{children}</AuthGuard>
  </StoreProvider>
);

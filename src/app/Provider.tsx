"use client";

import React from "react";
import { NotificationProvider } from "web3uikit";
import { MoralisProvider } from "react-moralis";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>{children}</NotificationProvider>
    </MoralisProvider>
  );
}

"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../../../packages/ui/src/lib/theme-provider";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

"use client";

import { NextUIProvider } from "@nextui-org/react";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};

"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Toast notifications — fixed light theme for predictable SaaS chrome */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      {...props}
    />
  );
}

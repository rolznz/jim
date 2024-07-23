import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "NWC Mint",
  description: "A bitcoin lightning mint that gives Nostr Wallet Connect Connection Strings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col justify-center items-center w-full h-full">
        {children}
      </body>
    </html>
  );
}

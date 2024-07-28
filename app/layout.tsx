import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "NWC Mint",
  description:
    "A bitcoin lightning mint that gives isolated NWC Connection Secrets that can be used in any NWC-powered app such as Damus, Amethyst, Alby Browser Extension and Alby Account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col justify-center items-center w-full h-full p-4">
        {children}
      </body>
    </html>
  );
}

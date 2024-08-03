import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@acme/ui";

import "~/app/globals.css";

export const metadata: Metadata = {
  title: "NextJs Zoid - Third Party Website",
  description: "Simple third party website with zoid example",
  openGraph: {
    title: "NextJs Zoid - Third Party Website",
    description: "Simple third party website with zoid example",
    url: "https://third-party-website-nnext-zoid.vercel.app",
    siteName: "NextJs Zoid - Third Party Website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
          {props.children}
      </body>
    </html>
  );
}

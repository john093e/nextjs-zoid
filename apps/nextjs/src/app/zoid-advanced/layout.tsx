import type { Metadata, Viewport } from "next";

import "~/app/globals.css";

import { ThemeProvider, ThemeToggle } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

export const metadata: Metadata = {
  title: "Advanced example with Zoid",
  description: "Advanced example with Zoid",
  openGraph: {
    title: "Advanced example with Zoid",
    description: "Advanced example with Zoid",
    url: "https://nextjs-zoid.vercel.app",
    siteName: "NextJs Zoid",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function ZoidAdvancedLayout(props: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 w-full h-auto min-h-screen">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {props.children}
        <div className="absolute bottom-4 right-4">
          <ThemeToggle />
        </div>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

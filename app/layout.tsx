"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./Provider";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "@/components/ui/toaster"


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import type { ReactNode } from "react";
import Providers from "./providers";

export const metadata = {
  title: "XeroLink",
  description: "Print & Service Platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Note: this file remains a Server Component (no "use client" here)
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

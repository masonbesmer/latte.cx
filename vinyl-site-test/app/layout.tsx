import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vinyl Crate Dashboard",
  description: "A vintage record store-styled homelab infrastructure dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

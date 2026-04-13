import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RiftScope",
  description: "A modern League of Legends stats hub scaffolded for future growth.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      {/* Keep the root layout minimal so future providers can be added cleanly. */}
      <body>{children}</body>
    </html>
  );
}

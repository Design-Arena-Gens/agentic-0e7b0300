import type { Metadata } from "next";
import "./globals.css";
import StoreInitializer from "./StoreInitializer";

export const metadata: Metadata = {
  title: "RewardSprint - Family Motivation & Rewards",
  description: "Automate allowance and rewards for your family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <StoreInitializer />
        {children}
      </body>
    </html>
  );
}

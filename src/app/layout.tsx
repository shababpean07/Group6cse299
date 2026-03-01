import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({ 
  subsets: ["latin"], 
  weight: ["600", "700", "800"], 
  variable: "--font-syne" 
});

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"], 
  variable: "--font-plus-jakarta" 
});

export const metadata: Metadata = {
  title: "NSU ClubHub",
  description: "North South University Club Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BENNA - Food Ordering App",
  description: "Order your favorite food now with BENNA",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-gray-100 text-gray-900 overflow-x-hidden">
        {/* هاد الـ div كيجبر التطبيق يبان كـ App حقيقي فالموبايل وفـ النص فـ PC */}
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
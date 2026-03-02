"use client"; // Only client components inside

import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "../components/Auth/AuthProvider";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { ThemeProvider } from "../components/ThemeProvider/ThemeProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen scroll-smooth`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster position="top-center" reverseOrder={false} />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
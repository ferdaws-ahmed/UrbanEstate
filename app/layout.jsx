import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import AuthProvider from "../src/components/AuthProvider/AuthProvider";
import { ThemeProvider } from "../src/components/ThemeProvider";

import ConditionalLayout from "../src/components/dashboard/admin/HomePageRelated/ConditionalLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        <AuthProvider>
          <ThemeProvider>
          
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
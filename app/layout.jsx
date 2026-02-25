import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../src/components/shared/Footer"; 
import Navbar from "../src/components/shared/Navbar"; 
// আপনার ফোল্ডার অনুযায়ী সঠিক পাথ দিয়ে ইম্পোর্ট করুন
import AuthProvider from "../src/components/AuthProvider/AuthProvider"; 

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* AuthProvider অবশ্যই Navbar এবং children-এর উপরে থাকতে হবে */}
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
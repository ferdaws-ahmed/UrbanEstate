import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "../components/Auth/AuthProvider";
import Footer from "../components/shared/Footer"; 
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Navbar from "../components/shared/Navbar";

// font settings (from tamim_new)
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Urban State | Intelligent Real Estate",
  description: "Next-generation real estate platform with geospatial intelligence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Navbar></Navbar>
          {/* Main content wrapper */}
          <div className="flex-grow">
            <main>{children}</main>
          </div>

          {/* Footer (from tamim_new */}
          <Footer />

          {/* Toast notifications */}
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}
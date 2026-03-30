"use client"; // usePathname use korar jonno client component hote hobe
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import AuthProvider from "../components/Auth/AuthProvider";
import Footer from "../components/shared/Footer";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/shared/Navbar";
import { ThemeProvider } from "../components/Theme/ThemeContext";
import { ReportProvider } from "../context/ReportContext";
import { ChatProvider } from "../context/ChatContext";
import FloatingChatButton from "../components/dashboard/admin/ChatRelated/FloatingChatButton";
import FloatingReportButton from "../components/dashboard/admin/ReportRelated/FloatingReportButton";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Check korchi path-ta '/dashboard' diye shuru kina
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ReportProvider>
              <ChatProvider>
                {/* Jodi Dashboard na hoy, tobei Navbar dekhabe */}
                {!isDashboard && <Navbar />}
                
                <div suppressHydrationWarning className="flex-grow">{children}</div>

                {/* Jodi Dashboard na hoy, tobei Footer dekhabe */}
                {!isDashboard && <Footer />}

                <Toaster position="top-center" />
                <FloatingChatButton />
                <FloatingReportButton />
              </ChatProvider>
            </ReportProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
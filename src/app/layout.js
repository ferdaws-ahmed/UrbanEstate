
import AuthProvider from "../components/Auth/AuthProvider";
import "./globals.css"; // Your global CSS
import { Toaster } from 'react-hot-toast';
export const metadata = {
  title: "UrbanEstate",
  description: "Real Estate Marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Your Navbar can go here */}
          <main>{children}</main>
          {/* Your Footer can go here */}
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
        
      </body>
    </html>
  );
}
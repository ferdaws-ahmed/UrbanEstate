"use client";
import { usePathname } from "next/navigation";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  

  const excludePaths = ["/login", "/register", "/dashboard"];
  const showLayout = !excludePaths.includes(pathname);

  return (
    <>
  
      
      {children}
      
  
    </>
  );
}
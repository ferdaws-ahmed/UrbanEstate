import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const isSellerRoute = path.startsWith("/sellproperty");

    if (isSellerRoute && token?.role !== "seller") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // allow request to continue
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Proxy-style matcher (recommended)
export const config = {
  matcher: [
    "/sellproperty/:path*", 
    "/dashboard/:path*",
    "/profile/:path*",
  ],
};
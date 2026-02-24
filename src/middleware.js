import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if the user is trying to access seller routes
    const isSellerRoute = path.startsWith("/sellproperty");

    if (isSellerRoute && token?.role !== "seller") {
      // If not a seller, redirect to home or an unauthorized page
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // This ensures the middleware only runs if the user is authenticated
      authorized: ({ token }) => !!token,
    },
  }
);

// Define which paths should be protected by this middleware
export const config = {
  matcher: [
    "/sellproperty/:path*", // Protect all routes starting with /sellproperty
    "/dashboard/:path*",    // Example: if you have a dashboard
    "/profile/:path*",      // Example: if you have a profile page
  ],
};
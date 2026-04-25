import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Check if user is logged in and trying to access /login
    if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow unauthenticated users to access login page
        if (req.nextUrl.pathname === "/login") {
          return true;
        }

        const protectedPrefixes = ["/dashboard", "/stock"];
        const isProtected = protectedPrefixes.some((prefix) =>
          req.nextUrl.pathname.startsWith(prefix)
        );

        if (req.nextUrl.pathname.startsWith("/stock/in")) {
          return token?.role === "ADMIN";
        }

        if (req.nextUrl.pathname.startsWith("/stock/history")) {
          return token?.role === "ADMIN";
        }

        if (isProtected) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/stock/:path*", "/login"],
};

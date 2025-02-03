import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Allow requests for authentication, login, or registration pages.
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }
        // Allow public routes.
        if (pathname === "/" || pathname.startsWith("/api/videos")) {
          return true;
        }
        // For private routes, allow if token exists.
        if (token) {
          return true;
        }
        // If no token and route is private, return false.
        return false;
      },
    },
    pages: {
      signIn: "/login", // Redirect unauthorized users to /login.
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

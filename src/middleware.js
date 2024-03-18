import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const authorizationHeader = req.headers.get("Authorization");
  const basyToken = req.cookies.get("basyToken")?.value;

  if (req.nextUrl.pathname.startsWith("/api/getAttendance")) {
    // Extract the Authorization header from the req headers
    const key = new TextEncoder().encode("yebaebdbaue");

    if (authorizationHeader) {
      // Check if the Authorization header starts with "Bearer "
      if (authorizationHeader.startsWith("Bearer ")) {
        // Extract the token by removing "Bearer " prefix
        const token = authorizationHeader.substring(7);
        try {
          await jwtVerify(token, key);
          return NextResponse.next();
        } catch (error) {
          console.log("token not verify");
          return NextResponse.redirect(new URL("/api/unauthorize", req.url));
        }
      } else {
        console.warn("Invalid authorization header format");
        return NextResponse.redirect(new URL("/api/unauthorize", req.url));
      }
    } else {
      console.warn("Authorization header not found");
      return NextResponse.redirect(new URL("/api/unauthorize", req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith("/meowmeow")) {
    if (basyToken) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/login")) {
    if (basyToken) {
      return NextResponse.redirect(new URL("/meowmeow", req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/api/getAttendance", "/meowmeow", "/login"],
};

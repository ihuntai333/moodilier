import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    if (pathname === "/admin/login") {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    const session = request.cookies.get("admin_session");
    if (!session || session.value !== "authenticated") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;

/**
 * Локализация:
 *  - /en, /en/* — английская версия (рендерится из сегмента [lang])
 *  - /ru, /ru/* — редирект на корневой путь (канонический URL без префикса)
 *  - всё остальное — rewrite на /ru/* (URL остаётся чистым)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Next 16 may run Proxy again for the destination of an internal rewrite.
  // Mark the default-locale pass so `/` can resolve to `/ru` without being
  // caught by the public `/ru` → `/` canonical redirect below.
  if (request.headers.get("x-default-locale-rewrite") === "1") {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  if (pathname === "/ru" || pathname.startsWith("/ru/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ru/, "") || "/";
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/ru${pathname === "/" ? "" : pathname}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-default-locale-rewrite", "1");
  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next|api|templates|images|fonts|.*\\..*).*)"],
};

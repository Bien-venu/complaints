import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const url = request.nextUrl.clone()

  
  const publicRoutes = ["/login", "/register"]

  
  if (publicRoutes.includes(url.pathname)) {
    
    if (token) {
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  
  if (!token) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

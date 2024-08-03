import { NextResponse } from "next/server";

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default function middleware() {
  // Here you can add your custom logic if needed

  // Return the response to proceed with the request
  return NextResponse.next();
}

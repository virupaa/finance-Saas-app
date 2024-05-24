import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

const isProtectedRoute = createRouteMatcher([
    "/",
    // "/api(.*)"
  ]);

  export default clerkMiddleware((auth, request) => {
    if(isProtectedRoute(request)){
        auth().protect();
    }
  });
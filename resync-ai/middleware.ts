import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedPaths = ["/dashboard", "/builder"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isProtected = protectedPaths.some((p) => path.startsWith(p));
  if (!isProtected) return response;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Demo / preview: no Supabase → allow builder & dashboard without login
  if (!url || !key || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return response;
  }

  const { createServerClient } = await import("@supabase/ssr");
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => {},
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|shaders).*)",
  ],
};

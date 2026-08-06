import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedPaths = ["/dashboard", "/builder"];
const adminPaths = ["/admin"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isAdminLogin = path === "/admin/login";
  const isAdmin = adminPaths.some((p) => path.startsWith(p)) && !isAdminLogin;
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (!isProtected && !isAdmin) return response;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Local/demo without Supabase: allow builder/dashboard, block admin shell
    if (isAdmin) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("error", "configure_supabase");
      return NextResponse.redirect(login);
    }
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
    const login = new URL(isAdmin ? "/admin/login" : "/login", request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  if (isAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("app_role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.app_role !== "admin") {
      // Report unauthorized attempt when service role available is handled in API;
      // middleware returns opaque redirect.
      const denied = new URL("/admin/login", request.url);
      denied.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(denied);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|shaders).*)",
  ],
};

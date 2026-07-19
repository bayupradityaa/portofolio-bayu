import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Refreshes the Supabase auth session in Next.js middleware.
 * Must be called on every request to keep the session alive.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — IMPORTANT: do NOT remove this line.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /dev/* routes (except /dev/login)
  const isDevRoute = request.nextUrl.pathname.startsWith("/dev");
  const isLoginPage = request.nextUrl.pathname === "/dev/login";

  if (isDevRoute && !isLoginPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dev/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login page
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dev";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

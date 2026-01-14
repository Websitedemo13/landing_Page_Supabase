import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const locales = ["vi", "en"]
const defaultLocale = "en"

function getLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale
    }
  }
  return defaultLocale
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Handle locale redirect for root
  if (pathname === "/" || pathname === "") {
    const locale = request.cookies.get("NEXT_LOCALE")?.value || defaultLocale
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (pathname.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  const locale = getLocale(pathname)
  supabaseResponse.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
  })

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

import { createClient as createServerClient } from "@/lib/supabase/server"

// --- PAGE QUERIES ---

export async function getPages() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
  return { data, error }
}

export async function getPageBySlug(slug: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()
  return { data, error }
}

export async function getPageSections(pageId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
  return { data, error }
}

// --- MENU QUERIES ---

export async function getMenuByLocation(location: "header" | "footer") {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .eq("location", location)
    .eq("is_visible", true)
    .limit(1)

  if (error) return { data: null, error }
  
  if (!data || data.length === 0) {
    return {
      data: {
        id: "default",
        name: location === "header" ? "Header Menu" : "Footer Menu",
        location,
        items: [],
        sort_order: 0,
        is_visible: true,
      },
      error: null,
    }
  }

  return { data: data[0], error: null }
}

// --- SITE CONFIG QUERIES (Fix lỗi favicon.ico) ---

export async function getSiteConfig() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("site_config")
    .select("*")
    .limit(1)

  if (error || !data || data.length === 0) {
    return {
      data: {
        id: "default",
        logo_url: null,
        logo_alt: "MoveUp Logo",
        social_links: {},
        footer_content: {},
        global_styles: {},
        favicon: { ico: "/favicon.ico" } // Fallback để không bị lỗi undefined
      },
      error: null,
    }
  }

  // Đảm bảo favicon luôn có giá trị để tránh crash Header
  const config = data[0]
  if (!config.favicon) {
    config.favicon = { ico: "/favicon.ico" }
  }

  return { data: config, error: null }
}

// --- FOOTER & SOCIAL QUERIES ---

export async function getFooterSections() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("footer_sections")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
  return { data, error }
}

export async function getSocialLinks() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
  return { data, error }
}
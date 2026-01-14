import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

// Page Queries
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
  const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).eq("is_published", true).single()
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

// Menu Queries
export async function getMenuByLocation(location: "header" | "footer") {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .eq("location", location)
    .eq("is_visible", true)
    .limit(1)

  // Return first item if exists, otherwise return default menu
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

// Site Config Queries
export async function getSiteConfig() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("site_config").select("*").limit(1)

  // Return first item if exists, otherwise return null
  if (error) return { data: null, error }
  if (!data || data.length === 0) {
    return {
      data: {
        id: "default",
        logo_url: null,
        logo_alt: null,
        social_links: {},
        footer_content: {},
        global_styles: {},
      },
      error: null,
    }
  }

  return { data: data[0], error: null }
}

// Footer Sections Queries
export async function getFooterSections() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("footer_sections")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
  return { data, error }
}

export async function updateFooterSection(id: string, updates: Record<string, any>) {
  const supabase = createBrowserClient()
  const { error } = await supabase.from("footer_sections").update(updates).eq("id", id)
  return { error }
}

// Social Links Queries
export async function getSocialLinks() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
  return { data, error }
}

export async function updateSocialLink(id: string, updates: Record<string, any>) {
  const supabase = createBrowserClient()
  const { error } = await supabase.from("social_links").update(updates).eq("id", id)
  return { error }
}

// Browser-based Admin Functions
export function getAdminClients() {
  return {
    supabase: createBrowserClient(),
  }
}

export async function getAllPages() {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase.from("pages").select("*").order("created_at", { ascending: false })
  return { data, error }
}

export async function createPage(pageData: {
  slug: string
  title: Record<string, string>
  seo_metadata?: Record<string, any>
  is_published?: boolean
}) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase.from("pages").insert([pageData]).select()
  return { data, error }
}

export async function updatePage(pageId: string, updates: Record<string, any>) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase.from("pages").update(updates).eq("id", pageId).select()
  return { data, error }
}

export async function deletePage(pageId: string) {
  const { supabase } = getAdminClients()
  const { error } = await supabase.from("pages").delete().eq("id", pageId)
  return { error }
}

// Page Sections Admin Functions
export async function getAllPageSections(pageId: string) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .order("sort_order", { ascending: true })
  return { data, error }
}

export async function createPageSection(sectionData: {
  page_id: string
  type: string
  layout_config: Record<string, any>
  content: Record<string, any>
  sort_order: number
}) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase.from("page_sections").insert([sectionData]).select()
  return { data, error }
}

export async function updatePageSection(sectionId: string, updates: Record<string, any>) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase.from("page_sections").update(updates).eq("id", sectionId).select()
  return { data, error }
}

export async function deletePageSection(sectionId: string) {
  const { supabase } = getAdminClients()
  const { error } = await supabase.from("page_sections").delete().eq("id", sectionId)
  return { error }
}

export async function reorderPageSections(pageId: string, sections: Array<{ id: string; sort_order: number }>) {
  const { supabase } = getAdminClients()
  const updates = sections.map((s) =>
    supabase.from("page_sections").update({ sort_order: s.sort_order }).eq("id", s.id),
  )
  const results = await Promise.all(updates)
  return results
}

export async function updateSectionVisibility(sectionId: string, isVisible: boolean) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("page_sections")
    .update({ is_visible: isVisible })
    .eq("id", sectionId)
    .select()
  return { data, error }
}

export async function updateSectionOrder(sectionId: string, newOrder: number) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("page_sections")
    .update({ sort_order: newOrder })
    .eq("id", sectionId)
    .select()
  return { data, error }
}

// Menu Admin Functions
export async function getAllMenus() {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase.from("menus").select("*").order("location", { ascending: true })
  return { data, error }
}

export async function updateMenu(menuId: string, updates: Record<string, any>) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase.from("menus").update(updates).eq("id", menuId).select()
  return { data, error }
}

// Site Config Admin Functions
export async function updateSiteConfig(updates: Record<string, any>) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase.from("site_config").update(updates).limit(1).select()
  return { data, error }
}

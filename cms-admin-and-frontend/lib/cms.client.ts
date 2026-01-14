"use client"

import { createClient as createBrowserClient } from "@/lib/supabase/client"

// Khởi tạo Supabase Client cho Browser
export function getAdminClients() {
  return {
    supabase: createBrowserClient(),
  }
}

// ==========================================
// 1. CÁC HÀM QUERY (Lấy dữ liệu cho UI)
// ==========================================

export async function getPages() {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
  return { data, error }
}

export async function getPageBySlug(slug: string) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()
  return { data, error }
}

export async function getPageSections(pageId: string) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
  return { data, error }
}

export async function getMenuByLocation(location: "header" | "footer") {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .eq("location", location)
    .eq("is_visible", true)
    .limit(1)

  if (error || !data || data.length === 0) {
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

export async function getSiteConfig() {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase.from("site_config").select("*").limit(1)

  // FIX: Chống lỗi "reading favicon.ico"
  if (error || !data || data.length === 0) {
    return {
      data: {
        id: "default",
        logo_url: null,
        logo_alt: "MoveUp",
        social_links: {},
        favicon: { ico: "/favicon.ico" }, // Default fallback
      },
      error: null,
    }
  }

  const config = data[0]
  if (!config.favicon) config.favicon = { ico: "/favicon.ico" }
  
  return { data: config, error: null }
}

// ==========================================
// 2. CÁC HÀM ADMIN (Quản lý Pages & Sections)
// ==========================================

export async function getAllPages() {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: false })
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

export async function reorderPageSections(sections: Array<{ id: string; sort_order: number }>) {
  const { supabase } = getAdminClients()
  const updates = sections.map((s) =>
    supabase.from("page_sections").update({ sort_order: s.sort_order }).eq("id", s.id)
  )
  const results = await Promise.all(updates)
  return results
}

// ==========================================
// 3. CÁC HÀM ADMIN (Config & Footer)
// ==========================================
// Cập nhật trạng thái Ẩn/Hiện của một Section
export async function updateSectionVisibility(sectionId: string, isVisible: boolean) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("page_sections")
    .update({ is_visible: isVisible })
    .eq("id", sectionId)
    .select()
  return { data, error }
}

// Cập nhật thứ tự sắp xếp của một Section (Dùng khi kéo thả đơn lẻ)
export async function updateSectionOrder(sectionId: string, newOrder: number) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("page_sections")
    .update({ sort_order: newOrder })
    .eq("id", sectionId)
    .select()
  return { data, error }
}
export async function updateSiteConfig(updates: Record<string, any>) {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase.from("site_config").update(updates).limit(1).select()
  return { data, error }
}

export async function getSocialLinks() {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
  return { data, error }
}

export async function updateSocialLink(id: string, updates: Record<string, any>) {
  const { supabase } = getAdminClients()
  const { error } = await supabase.from("social_links").update(updates).eq("id", id)
  return { error }
}

export async function getFooterSections() {
  const { supabase } = getAdminClients()
  const { data, error } = await supabase
    .from("footer_sections")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
  return { data, error }
}

export async function updateFooterSection(id: string, updates: Record<string, any>) {
  const { supabase } = getAdminClients()
  const { error } = await supabase.from("footer_sections").update(updates).eq("id", id)
  return { error }
}
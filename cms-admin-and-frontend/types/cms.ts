export type SectionType = "hero" | "grid" | "content" | "faq" | "cta"

export interface Page {
  id: string
  slug: string
  title: Record<string, string>
  seo_metadata: Record<string, any>
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface PageSection {
  id: string
  page_id: string
  type: SectionType
  layout_config: Record<string, any>
  content: Record<string, any>
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  label: Record<string, string>
  url: string
  is_external: boolean
  sort_order: number
}

export interface Menu {
  id: string
  name: string
  location: "header" | "footer"
  items: MenuItem[]
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface SiteConfig {
  id: string
  logo_url: string
  logo_alt: string
  social_links: Record<string, string>
  footer_content: Record<string, any>
  global_styles: Record<string, any>
  created_at: string
  updated_at: string
}

export interface HeroLayoutConfig {
  variant: "full" | "split" | "minimal"
  imagePosition: "left" | "right" | "background"
  imageUrl?: string
}

export interface GridLayoutConfig {
  columns: 3 | 4 | 5
}

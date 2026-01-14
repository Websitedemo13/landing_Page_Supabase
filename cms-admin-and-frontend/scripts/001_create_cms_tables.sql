-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Site Configuration Table
CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT,
  logo_alt TEXT,
  social_links JSONB DEFAULT '{}',
  footer_content JSONB DEFAULT '{}',
  global_styles JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Menus Table (Header/Footer Navigation)
CREATE TABLE IF NOT EXISTS public.menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('header', 'footer')),
  items JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pages Table
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title JSONB NOT NULL DEFAULT '{"vi": "", "en": ""}',
  seo_metadata JSONB DEFAULT '{"vi": {}, "en": {}}',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Page Sections Table
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('hero', 'grid', 'content', 'faq', 'cta')),
  layout_config JSONB DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '{"vi": {}, "en": {}}',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Public Read Access (CMS content is public)
CREATE POLICY "site_config_select_public"
  ON public.site_config FOR SELECT
  USING (TRUE);

CREATE POLICY "menus_select_public"
  ON public.menus FOR SELECT
  USING (TRUE);

CREATE POLICY "pages_select_public"
  ON public.pages FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "page_sections_select_public"
  ON public.page_sections FOR SELECT
  USING (is_visible = TRUE);

-- RLS Policies for Admin (All operations)
CREATE POLICY "site_config_all_admin"
  ON public.site_config FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "menus_all_admin"
  ON public.menus FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "pages_all_admin"
  ON public.pages FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "page_sections_all_admin"
  ON public.page_sections FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

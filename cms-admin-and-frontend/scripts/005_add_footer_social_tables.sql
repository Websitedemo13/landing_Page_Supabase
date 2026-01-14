-- D:\JOBS\landing_Page_Supabase\cms-admin-and-frontend\scripts\005_add_footer_social_tables.sql--
-- Footer Table for managing footer content
CREATE TABLE IF NOT EXISTS public.footer_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title JSONB NOT NULL DEFAULT '{"vi": "", "en": ""}',
  description JSONB DEFAULT '{"vi": "", "en": ""}',
  column_position INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Social Links Table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  icon_type TEXT DEFAULT 'icon',
  sort_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.footer_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Footer Sections
CREATE POLICY "footer_sections_select_public" ON public.footer_sections FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "footer_sections_all_admin" ON public.footer_sections FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Social Links
CREATE POLICY "social_links_select_public" ON public.social_links FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "social_links_all_admin" ON public.social_links FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Initialize default social links
INSERT INTO public.social_links (platform, url, icon_type, sort_order, is_visible) VALUES
  ('facebook', '', 'icon', 0, TRUE),
  ('twitter', '', 'icon', 1, TRUE),
  ('instagram', '', 'icon', 2, TRUE),
  ('linkedin', '', 'icon', 3, TRUE),
  ('github', '', 'icon', 4, TRUE)
ON CONFLICT DO NOTHING;

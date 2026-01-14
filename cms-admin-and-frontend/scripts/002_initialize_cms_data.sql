--D:\JOBS\landing_Page_Supabase\cms-admin-and-frontend\scripts\002_initialize_cms_data.sql--
-- Initialize default site configuration
INSERT INTO public.site_config (
  logo_url,
  logo_alt,
  social_links,
  footer_content,
  global_styles
) VALUES (
  '/logo.png',
  'Site Logo',
  '{"facebook": "", "twitter": "", "instagram": ""}',
  '{"company_name": "", "address": "", "phone": ""}',
  '{"primary_color": "#2563eb", "secondary_color": "#64748b"}'
) ON CONFLICT DO NOTHING;

-- Initialize header menu
INSERT INTO public.menus (name, location, items, sort_order, is_visible) VALUES (
  'Header Menu',
  'header',
  '[
    {"label_vi": "Trang chủ", "label_en": "Home", "href": "/", "is_visible": true},
    {"label_vi": "Giới thiệu", "label_en": "About", "href": "/about", "is_visible": true},
    {"label_vi": "Liên hệ", "label_en": "Contact", "href": "/contact", "is_visible": true}
  ]',
  0,
  true
) ON CONFLICT DO NOTHING;

-- Initialize footer menu
INSERT INTO public.menus (name, location, items, sort_order, is_visible) VALUES (
  'Footer Menu',
  'footer',
  '[
    {"label_vi": "Điều khoản", "label_en": "Terms", "href": "/terms", "is_visible": true},
    {"label_vi": "Chính sách", "label_en": "Privacy", "href": "/privacy", "is_visible": true}
  ]',
  0,
  true
) ON CONFLICT DO NOTHING;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true) ON CONFLICT DO NOTHING;

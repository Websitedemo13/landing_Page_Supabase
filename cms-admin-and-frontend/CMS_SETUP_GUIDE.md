# CMS Admin & Frontend Setup Guide

## Overview
This is a complete multilingual (Vietnamese/English) website builder CMS with:
- Dynamic page management system
- Drag-and-drop section editor
- Built-in image upload to Supabase Storage
- Admin authentication with email/password
- Row-level security for data protection
- Responsive design with dark mode support

## Prerequisites
- Supabase project already created
- Environment variables configured in Vercel/v0
- Node.js 18+ (for local development)

## Step 1: Create Database Tables

Run the SQL migration scripts in your Supabase SQL Editor:

1. **Create tables and enable RLS:**
   - Execute: `scripts/001_create_cms_tables.sql`
   - This creates: `site_config`, `menus`, `pages`, `page_sections` tables
   - Enables Row-Level Security policies

2. **Initialize default data:**
   - Execute: `scripts/002_initialize_cms_data.sql`
   - Creates default site configuration and menus
   - Sets up the `cms-images` storage bucket

## Step 2: Create Admin User Account

### Option A: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click **Authentication** → **Users** tab
3. Click **Invite user**
4. Enter email: `tester.s17.org.vn@gmail.com`
5. Check **Auto confirm user** checkbox
6. Click **Send invite**
7. The account is now created

### Option B: Via Supabase API
```bash
# Using curl (replace SUPABASE_URL and SERVICE_ROLE_KEY)
curl -X POST "https://YOUR_SUPABASE_URL/auth/v1/admin/users" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tester.s17.org.vn@gmail.com",
    "password": "123456",
    "email_confirm": true
  }'
```

## Step 3: Verify Database Setup

1. Open Supabase SQL Editor
2. Run this query to verify tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('site_config', 'menus', 'pages', 'page_sections');
```

3. Verify storage bucket:
```sql
SELECT name FROM storage.buckets WHERE id = 'cms-images';
```

## Step 4: Configure Storage Bucket Permissions

1. Go to **Storage** → **cms-images** bucket
2. Click **Policies**
3. Create policy for public read access:
   ```sql
   CREATE POLICY "Public Read Access" ON storage.objects
   FOR SELECT USING (bucket_id = 'cms-images');
   ```
4. Create policy for authenticated write access:
   ```sql
   CREATE POLICY "Authenticated Upload" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'cms-images' AND auth.role() = 'authenticated');
   ```

## Step 5: Access the CMS

### Admin Dashboard
- URL: `http://localhost:3000/admin`
- Email: `tester.s17.org.vn@gmail.com`
- Password: `123456`

### Frontend
- Home: `http://localhost:3000/vi` (Vietnamese)
- Home: `http://localhost:3000/en` (English)

## Features

### Admin Dashboard (`/admin`)
- **Page Management**: Create, edit, and publish pages
- **Section Editor**: Add different section types:
  - Hero sections with layout variants (full, split, minimal)
  - Grid sections (3, 4, or 5 columns)
  - Content sections
  - FAQ sections
  - CTA sections
- **Image Upload**: Upload images directly from computer to Supabase Storage
- **Multilingual Support**: Edit content in Vietnamese and English
- **Live Publish**: Toggle page visibility with publish/draft status
- **Drag & Drop**: Reorder sections with drag-and-drop interface

### Frontend
- **Dynamic Rendering**: Pages render based on database content
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Language Switcher**: Switch between Vietnamese and English
- **Navigation**: Auto-generated menus from database
- **Dark Mode**: Full dark mode support

## Creating Your First Page

1. Login to admin dashboard
2. Click **New Page**
3. Fill in:
   - **Page Slug**: e.g., `about` (URL will be `/en/about` or `/vi/about`)
   - **Title (VI)**: Vietnamese title
   - **Title (EN)**: English title
4. Click **Create Page**
5. Select the page from the left panel
6. Click **Add Section**
7. Choose section type (Hero, Grid, Content, FAQ, CTA)
8. Click **Add**
9. Configure section:
   - Edit layout options (variant, columns, etc.)
   - Add Vietnamese content and image
   - Add English content and image
   - Click **Save Changes**
10. Click **Publish** button to make page visible on frontend

## Image Upload

### How It Works
1. In the section editor, click the upload area
2. Select an image from your computer (PNG, JPG, GIF, WebP)
3. Max file size: 5MB
4. Image automatically uploads to Supabase Storage
5. Public URL is saved and displayed

### Image Storage
- **Location**: `cms-images/pages/{timestamp}-{random}.{ext}`
- **Public URL**: Automatically generated and accessible
- **Delete**: Click the X button to remove image

## Troubleshooting

### Login Issues
- Verify admin user is created in Supabase Auth
- Check email is exactly: `tester.s17.org.vn@gmail.com`
- Verify password is: `123456`
- Check RLS policies allow authenticated users

### Image Upload Fails
- Verify `cms-images` storage bucket exists
- Check storage bucket has public read policy
- Ensure authenticated users have write permission
- Verify file size is under 5MB
- Check file type is a valid image format

### Pages Not Showing on Frontend
- Verify page is in **Published** status (not Draft)
- Check page slug matches URL path
- Verify `pages` table RLS policy allows public read for published pages
- Check `is_published = true` in database

### Database Errors
- Run `scripts/001_create_cms_tables.sql` again
- Run `scripts/002_initialize_cms_data.sql` again
- Check all required environment variables are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## API Endpoints

### CMS Functions (`lib/cms.ts`)
- `getPages()`: Get all published pages
- `getPageBySlug(slug)`: Get single page by slug
- `getPageSections(pageId)`: Get sections for a page
- `getAllPages()`: Admin - Get all pages
- `createPage(data)`: Admin - Create new page
- `updatePage(id, updates)`: Admin - Update page
- `createPageSection(data)`: Admin - Add section
- `updatePageSection(id, updates)`: Admin - Update section
- `deletePageSection(id)`: Admin - Delete section

### Storage Functions (`lib/supabase/storage.ts`)
- `uploadImage(file, folder)`: Upload image to storage
- `deleteImage(filePath)`: Delete image from storage
- `getPublicUrl(filePath)`: Get public URL for image

## Security

### Row-Level Security (RLS)
- Public can read published pages and sections
- Only authenticated users can modify content
- Storage bucket restricted to authenticated uploads

### Environment Variables
- All sensitive keys stored in environment (never commit to repo)
- Service role key only used server-side
- Anon key safe for public use

## Production Deployment

### Before Deploying
1. Create production admin user (update email/password)
2. Test all features on staging
3. Enable HTTPS (automatic on Vercel)
4. Configure custom domain in Supabase
5. Set production environment variables

### Deploy to Vercel
1. Push code to GitHub
2. Connect to Vercel project
3. Set environment variables in Vercel dashboard
4. Deploy!

## Support & Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)

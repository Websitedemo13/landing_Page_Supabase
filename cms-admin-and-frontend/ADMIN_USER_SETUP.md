# Setting Up the Admin User

## Quick Setup (Email: tester.s17.org.vn@gmail.com)

### Step 1: Create Admin User in Supabase

**Method 1: Supabase Dashboard (Easiest)**
1. Go to: `https://app.supabase.com/`
2. Select your project
3. Click **Authentication** → **Users**
4. Click **Invite user**
5. Enter:
   - Email: `tester.s17.org.vn@gmail.com`
   - Check "Auto confirm user"
6. Click **Send invite**

**Method 2: SQL Editor**
```sql
-- Run this in Supabase SQL Editor if the invite method doesn't work
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'tester.s17.org.vn@gmail.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{}',
  false
);
```

### Step 2: Verify User Was Created
1. Go to Supabase Dashboard
2. Click **Authentication** → **Users**
3. You should see `tester.s17.org.vn@gmail.com` in the list

### Step 3: Test Login
1. Go to: `http://localhost:3000/auth/login`
2. Enter credentials:
   - Email: `tester.s17.org.vn@gmail.com`
   - Password: `123456`
3. Click **Login**
4. You should be redirected to `/admin`

## Changing Admin Password

### Via Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click on the user email
3. Click **Update password**
4. Enter new password
5. Click **Update**

### Via SQL (if needed)
```sql
UPDATE auth.users 
SET encrypted_password = crypt('new_password_here', gen_salt('bf'))
WHERE email = 'tester.s17.org.vn@gmail.com';
```

## Managing Multiple Admin Users

To add more admin users:
1. Repeat the "Create Admin User" steps
2. Use a different email address
3. Share the password securely with the admin

All authenticated users have full admin access. To restrict access:
1. Update RLS policies in database
2. Create a `user_roles` table
3. Update CMS functions to check user role

## Troubleshooting

### "User not found" error
- Verify email is exactly: `tester.s17.org.vn@gmail.com`
- Check user was created in Supabase dashboard
- Try clearing browser cookies and retry

### "Invalid credentials" error
- Verify password is exactly: `123456`
- Check caps lock is off
- Try resetting password in Supabase dashboard

### Can't access `/admin`
- Verify user is authenticated (check Supabase Auth logs)
- Check RLS policies allow authenticated access
- Verify proxy.ts middleware is redirecting unauthenticated users to `/auth/login`

## Security Tips

1. Change the default password immediately in production
2. Use strong passwords (12+ characters, mix of uppercase/lowercase/numbers/symbols)
3. Enable multi-factor authentication in Supabase
4. Regularly audit user access logs
5. Remove unused admin accounts

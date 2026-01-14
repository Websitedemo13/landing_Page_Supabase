import type React from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "CMS Admin Dashboard",
  description: "Manage your website content, pages, and settings",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

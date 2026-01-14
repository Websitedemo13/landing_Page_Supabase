import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BackToTop } from "@/components/layout/back-to-top"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CMS Site",
  description: "Dynamic CMS-powered website",
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="cms-theme">
          {children}
          <BackToTop />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}

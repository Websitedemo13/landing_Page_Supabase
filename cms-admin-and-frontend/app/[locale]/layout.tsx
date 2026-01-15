import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BackToTop } from "@/components/layout/back-to-top"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CMS Site",
  description: "Dynamic CMS-powered website",
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <html suppressHydrationWarning className={geist.className} lang={locale}>
      <body className={`${geistMono.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="cms-theme">
          {children}
          <BackToTop />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}

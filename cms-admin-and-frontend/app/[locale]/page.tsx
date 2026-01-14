import type { Metadata } from "next"
import { getPages, getSiteConfig, getMenuByLocation } from "@/lib/cms.client"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const title = locale === "vi" ? "CMS Site - Trang chủ" : "CMS Site - Home"
  const description =
    locale === "vi"
      ? "Khám phá trang web được xây dựng bằng CMS mạnh mẽ"
      : "Discover a website built with a powerful CMS"

  return {
    title,
    description,
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const { data: pages } = await getPages()
  const { data: siteConfig } = await getSiteConfig()
  const { data: headerMenu } = await getMenuByLocation("header")
  const { data: footerMenu } = await getMenuByLocation("footer")

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col">
      <Header menu={headerMenu} siteConfig={siteConfig} locale={locale} />

      <main className="flex-grow">
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="relative z-10 text-center max-w-3xl px-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance mb-6">
              {locale === "vi" ? "🎉 Chào mừng đến CMS Site" : "🎉 Welcome to CMS Site"}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 text-balance mb-8">
              {locale === "vi"
                ? "Quản lý và tạo nội dung động một cách dễ dàng với hệ thống CMS mạnh mẽ"
                : "Create and manage dynamic content with an easy-to-use, powerful CMS system"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}#pages`}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                {locale === "vi" ? "🚀 Khám phá" : "🚀 Explore"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section id="pages" className="w-full py-16 px-6 md:px-12 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-balance text-foreground animate-fade-in-up">
              {locale === "vi" ? "📄 Các trang khả dụng" : "📄 Available Pages"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages?.map((page, index) => (
                <Link
                  key={page.id}
                  href={`/${locale}/${page.slug}`}
                  className="group card-hover overflow-hidden border border-border animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200 text-balance">
                      {page.title[locale] || page.title.en}
                    </h3>
                    <p className="text-foreground/60 text-sm mt-2">
                      /{locale}/{page.slug}
                    </p>
                    <div className="flex items-center gap-2 text-primary mt-4 group-hover:translate-x-2 transition-transform duration-200">
                      {locale === "vi" ? "Xem chi tiết" : "View"}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {!pages ||
              (pages.length === 0 && (
                <div className="text-center py-12 text-foreground/50">
                  <p>{locale === "vi" ? "Chưa có trang nào" : "No pages available yet"}</p>
                </div>
              ))}
          </div>
        </section>
      </main>

      <Footer menu={footerMenu} siteConfig={siteConfig} locale={locale} />
    </div>
  )
}

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
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 dark:from-primary/20 dark:via-background dark:to-accent/20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse-slow" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 text-center max-w-3xl px-6 animate-fade-in-up">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-primary/20 text-primary border border-primary/30">
                {locale === "vi" ? "✨ Hệ thống CMS mạnh mẽ" : "✨ Powerful CMS System"}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance mb-6 leading-tight">
              {locale === "vi" ? "Quản lý nội dung một cách thông minh" : "Manage Content Intelligently"}
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 text-balance mb-10 leading-relaxed">
              {locale === "vi"
                ? "Tạo, chỉnh sửa và quản lý nội dung động một cách dễ dàng với hệ thống CMS tiên tiến của chúng tôi. Không cần kỹ năng lập trình."
                : "Create, edit, and manage dynamic content effortlessly with our advanced CMS system. No coding skills required."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}#pages`}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 inline-flex items-center justify-center gap-2 group"
              >
                {locale === "vi" ? "🚀 Khám phá ngay" : "🚀 Explore Now"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a
                href="#pages"
                className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                {locale === "vi" ? "📄 Xem trang" : "📄 View Pages"}
              </a>
            </div>
          </div>
        </section>

        <section id="pages" className="w-full py-24 px-6 md:px-12 bg-background relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance mb-4">
                {locale === "vi" ? "📄 Các trang có sẵn" : "📄 Available Pages"}
              </h2>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                {locale === "vi"
                  ? "Khám phá các trang được quản lý bởi hệ thống CMS của chúng tôi"
                  : "Explore pages managed by our CMS system"}
              </p>
            </div>

            {pages && pages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pages?.map((page, index) => (
                  <Link
                    key={page.id}
                    href={`/${locale}/${page.slug}`}
                    className="group"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="relative h-full overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative p-8">
                        <div className="inline-block mb-4 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                          {locale === "vi" ? "Trang" : "Page"}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 text-balance mb-3">
                          {page.title[locale] || page.title.en}
                        </h3>
                        <p className="text-foreground/60 text-sm mb-6">
                          /{locale}/{page.slug}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                          {locale === "vi" ? "Xem chi tiết" : "View Details"}
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-block mb-4">
                  <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-lg text-foreground/60 font-medium">
                  {locale === "vi" ? "Chưa có trang nào" : "No pages available yet"}
                </p>
                <p className="text-sm text-foreground/40 mt-2">
                  {locale === "vi" ? "Tạo trang đầu tiên của bạn để bắt đầu" : "Create your first page to get started"}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer menu={footerMenu} siteConfig={siteConfig} locale={locale} />
    </div>
  )
}

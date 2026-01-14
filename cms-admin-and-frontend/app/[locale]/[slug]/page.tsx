import { getPageBySlug, getPageSections, getSiteConfig, getMenuByLocation } from "@/lib/cms"
import { SectionFactory } from "@/components/cms/section-factory"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function DynamicPage({ params }: PageProps) {
  const { locale, slug } = await params

  const { data: page, error: pageError } = await getPageBySlug(slug)
  if (pageError || !page) {
    notFound()
  }

  const { data: sections, error: sectionsError } = await getPageSections(page.id)
  const { data: siteConfig } = await getSiteConfig()
  const { data: headerMenu } = await getMenuByLocation("header")
  const { data: footerMenu } = await getMenuByLocation("footer")

  if (sectionsError) {
    notFound()
  }

  return (
    <div suppressHydrationWarning className="min-h-screen flex flex-col">
      <Header menu={headerMenu} siteConfig={siteConfig} locale={locale} />
      <main className="flex-grow">
        {sections && sections.length > 0 ? (
          sections.map((section) => <SectionFactory key={section.id} section={section} locale={locale} />)
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-500">No sections found for this page</p>
          </div>
        )}
      </main>
      <Footer menu={footerMenu} siteConfig={siteConfig} locale={locale} />
    </div>
  )
}

"use client"
import type { PageSection } from "@/types/cms"
import { HeroSection } from "@/components/cms/hero-section"
import { GridSection } from "@/components/cms/grid-section"
import { ContentSection } from "@/components/cms/content-section"
import { FaqSection } from "@/components/cms/faq-section"
import { CtaSection } from "@/components/cms/cta-section"
import { X, Eye } from "lucide-react"

interface SectionPreviewProps {
  section: PageSection
  locale: "vi" | "en"
  onClose: () => void
}

export function SectionPreview({ section, locale, onClose }: SectionPreviewProps) {
  const getPreviewComponent = () => {
    switch (section.type) {
      case "hero":
        return <HeroSection section={section} locale={locale} />
      case "grid":
        return <GridSection section={section} locale={locale} />
      case "content":
        return <ContentSection content={section.content} locale={locale} />
      case "faq":
        return <FaqSection content={section.content} locale={locale} />
      case "cta":
        return <CtaSection content={section.content} locale={locale} />
      default:
        return <div className="p-8 text-center text-gray-500">Preview not available</div>
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preview - {section.type.toUpperCase()} ({locale.toUpperCase()})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
            aria-label="Close preview"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">{getPreviewComponent()}</div>
        </div>
      </div>
    </div>
  )
}

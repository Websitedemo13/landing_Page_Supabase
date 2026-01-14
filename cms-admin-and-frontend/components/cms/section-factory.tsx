"use client"

import { HeroSection } from "./hero-section"
import { GridSection } from "./grid-section"
import { ContentSection } from "./content-section"
import { FaqSection } from "./faq-section"
import { CtaSection } from "./cta-section"
import type { PageSection } from "@/types/cms"

interface SectionFactoryProps {
  section: PageSection
  locale: string
}

export function SectionFactory({ section, locale }: SectionFactoryProps) {
  const { type, layout_config, content } = section

  switch (type) {
    case "hero":
      return <HeroSection content={content} layoutConfig={layout_config} locale={locale} />
    case "grid":
      return <GridSection content={content} layoutConfig={layout_config} locale={locale} />
    case "content":
      return <ContentSection content={content} locale={locale} />
    case "faq":
      return <FaqSection content={content} locale={locale} />
    case "cta":
      return <CtaSection content={content} locale={locale} />
    default:
      return null
  }
}

"use client"

import type { HeroLayoutConfig } from "@/types/cms"
import Image from "next/image"

interface HeroSectionProps {
  content: Record<string, any>
  layoutConfig: HeroLayoutConfig
  locale: string
}

export function HeroSection({ content, layoutConfig, locale }: HeroSectionProps) {
  const data = content[locale] || content.en
  const { variant, imagePosition, imageUrl } = layoutConfig

  if (variant === "full") {
    return (
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="relative z-10 text-center text-white max-w-2xl px-6 animate-fade-in-up">
          <h1 className="heading-lg mb-6">{data.title}</h1>
          <p className="text-xl md:text-2xl text-balance mb-8 text-gray-100">{data.subtitle}</p>
          {data.cta_text && (
            <button className="btn-primary bg-white text-black hover:bg-gray-100 dark:hover:bg-gray-200">
              {data.cta_text}
            </button>
          )}
        </div>
      </section>
    )
  }

  if (variant === "split") {
    const isImageLeft = imagePosition === "left"
    return (
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center section-py section-px section-container">
          <div className={isImageLeft ? "order-2 animate-fade-in-up" : "order-1 animate-fade-in-up"}>
            <h1 className="heading-md mb-4">{data.title}</h1>
            <p className="text-lg text-muted mb-6 text-balance">{data.subtitle}</p>
            {data.cta_text && <button className="btn-primary">{data.cta_text}</button>}
          </div>
          {imageUrl && (
            <div className={isImageLeft ? "order-1" : "order-2"}>
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={data.title}
                width={500}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          )}
        </div>
      </section>
    )
  }

  // minimal variant
  return (
    <section className="w-full section-py section-px bg-muted/5">
      <div className="section-container max-w-3xl animate-fade-in-up">
        <h1 className="heading-sm mb-3">{data.title}</h1>
        <p className="text-muted text-lg text-balance">{data.subtitle}</p>
      </div>
    </section>
  )
}

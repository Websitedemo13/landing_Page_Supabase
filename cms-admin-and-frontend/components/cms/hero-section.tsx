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
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-48 -mb-48" />
        </div>
        <div className="relative z-10 text-center text-white max-w-3xl px-6 animate-fade-in-up">
          <div className="inline-block mb-6 px-4 py-2 rounded-full text-sm font-semibold bg-white/20 border border-white/30 backdrop-blur-sm">
            {data.subtitle}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">{data.title}</h1>
          {data.description && (
            <p className="text-lg md:text-xl text-white/80 text-balance mb-10 leading-relaxed max-w-2xl mx-auto">
              {data.description}
            </p>
          )}
          {data.cta_text && (
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
              {data.cta_text}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>
      </section>
    )
  }

  if (variant === "split") {
    const isImageLeft = imagePosition === "left"
    return (
      <section className="w-full py-24 px-6 md:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={isImageLeft ? "order-2 animate-fade-in-up" : "order-1 animate-fade-in-up"}>
              <div className="inline-block mb-4 px-4 py-2 rounded-lg bg-primary/20 text-primary text-xs font-semibold">
                ✨ {data.subtitle}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground text-balance leading-tight">{data.title}</h1>
              {data.description && (
                <p className="text-lg text-foreground/70 mb-8 text-balance leading-relaxed">{data.description}</p>
              )}
              {data.cta_text && (
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  {data.cta_text}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              )}
            </div>
            {imageUrl && (
              <div className={isImageLeft ? "order-1 animate-fade-in" : "order-2 animate-fade-in"}>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={data.title}
                    width={600}
                    height={500}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // minimal variant
  return (
    <section className="w-full py-24 px-6 md:px-12 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <div className="inline-block mb-4 px-4 py-2 rounded-lg bg-primary/20 text-primary text-xs font-semibold">
          ✨ Featured
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-balance leading-tight">{data.title}</h1>
        <p className="text-lg text-foreground/70 text-balance leading-relaxed">{data.subtitle}</p>
      </div>
    </section>
  )
}

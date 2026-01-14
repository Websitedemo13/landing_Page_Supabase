"use client"

interface CtaSectionProps {
  content: Record<string, any>
  locale: string
}

export function CtaSection({ content, locale }: CtaSectionProps) {
  const data = content[locale] || content.en

  return (
    <section className="w-full section-py section-px bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="section-container max-w-3xl text-center animate-fade-in-up">
        <h2 className="heading-md mb-6">{data.title}</h2>
        {data.subtitle && <p className="text-xl mb-8 text-balance opacity-90">{data.subtitle}</p>}
        {data.cta_text && (
          <button className="btn-primary bg-white text-primary hover:bg-gray-100">{data.cta_text}</button>
        )}
      </div>
    </section>
  )
}

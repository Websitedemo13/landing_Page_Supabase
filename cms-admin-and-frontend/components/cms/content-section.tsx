"use client"

interface ContentSectionProps {
  content: Record<string, any>
  locale: string
}

export function ContentSection({ content, locale }: ContentSectionProps) {
  const data = content[locale] || content.en

  return (
    <section className="w-full py-16 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        {data.title && <h2 className="text-4xl font-bold mb-8 text-balance">{data.title}</h2>}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data.body }} />
      </div>
    </section>
  )
}

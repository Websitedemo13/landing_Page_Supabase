"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FaqSectionProps {
  content: Record<string, any>
  locale: string
}

export function FaqSection({ content, locale }: FaqSectionProps) {
  const data = content[locale] || content.en
  const items = data.items || []
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="w-full section-py section-px bg-muted/5">
      <div className="section-container max-w-3xl">
        {data.title && (
          <h2 className="heading-md mb-12 text-center text-foreground animate-fade-in-up">{data.title}</h2>
        )}
        <div className="space-y-4">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="card-hover overflow-hidden animate-fade-in-up"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/5 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-foreground pr-4">{item.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-primary transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-foreground/70 border-t border-border animate-slide-in-up">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

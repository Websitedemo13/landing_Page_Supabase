"use client"

import type { GridLayoutConfig } from "@/types/cms"

interface GridSectionProps {
  content: Record<string, any>
  layoutConfig: GridLayoutConfig
  locale: string
}

export function GridSection({ content, layoutConfig, locale }: GridSectionProps) {
  const data = content[locale] || content.en
  const { columns } = layoutConfig
  const items = data.items || []

  const gridColsClass =
    {
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
    }[columns] || "grid-cols-1 md:grid-cols-3"

  return (
    <section className="w-full section-py section-px bg-gradient-to-b from-background to-background">
      <div className="section-container">
        {data.title && (
          <h2 className="heading-md mb-12 text-center text-foreground animate-fade-in-up">{data.title}</h2>
        )}
        <div className={`grid ${gridColsClass} gap-8`}>
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="card-hover p-6 animate-fade-in-up overflow-hidden group"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {item.image && (
                <div className="overflow-hidden rounded-md mb-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-md group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-foreground/70">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

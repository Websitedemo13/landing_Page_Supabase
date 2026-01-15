"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import type { Menu as MenuType } from "@/types/cms"

interface MobileMenuProps {
  menu: MenuType | null
  locale: string
}

export function MobileMenu({ menu, locale }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-foreground/10 transition-colors duration-200"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-xl z-50 animate-fade-in">
          <nav className="flex flex-col p-4 gap-1">
            {menu?.items?.map((item) => {
              const label = item?.label ? (typeof item.label === "object" ? (item.label[locale] || item.label.en || "Menu Item") : item.label) : "Menu Item"
              return (
                <Link
                  key={item.id}
                  href={item.is_external ? item.url : `/${locale}${item.url}`}
                  target={item.is_external ? "_blank" : undefined}
                  rel={item.is_external ? "noopener noreferrer" : undefined}
                  className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  )
}

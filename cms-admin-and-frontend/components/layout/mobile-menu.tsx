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
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b shadow-lg z-50">
          <nav className="flex flex-col">
            {menu?.items?.map((item) => (
              <Link
                key={item.id}
                href={item.is_external ? item.url : `/${locale}${item.url}`}
                target={item.is_external ? "_blank" : undefined}
                className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-b last:border-b-0 transition"
                onClick={() => setIsOpen(false)}
              >
                {item.label[locale] || item.label.en}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

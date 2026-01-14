"use client"

import Link from "next/link"
import type { Menu } from "@/types/cms"
import type { SiteConfig } from "@/types/cms"
import Image from "next/image"
import { LanguageSwitcher } from "./language-switcher"
import { MobileMenu } from "./mobile-menu"

interface HeaderProps {
  menu: Menu | null
  siteConfig: SiteConfig | null
  locale: string
}

export function Header({ menu, siteConfig, locale }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-card border-b border-gray-200 dark:border-border shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-card/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2 hover:opacity-80 transition">
            {siteConfig?.logo_url && (
              <Image
                src={siteConfig.logo_url || "/placeholder.svg"}
                alt={siteConfig.logo_alt || "Logo"}
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            )}
            <span className="font-bold text-lg hidden sm:inline text-foreground">
              {locale === "vi" ? "Trang Chủ" : "CMS Site"}
            </span>
          </Link>

          <nav className="hidden md:flex gap-8">
            {menu?.items?.map((item) => (
              <Link
                key={item.id}
                href={item.is_external ? item.url : `/${locale}${item.url}`}
                target={item.is_external ? "_blank" : undefined}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                {item.label[locale] || item.label.en}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <MobileMenu menu={menu} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  )
}

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${locale}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 group">
            {siteConfig?.logo_url ? (
              <Image
                src={siteConfig.logo_url || "/placeholder.svg"}
                alt={siteConfig.logo_alt || "Logo"}
                width={32}
                height={32}
                className="h-8 w-auto group-hover:scale-110 transition-transform duration-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="font-bold text-sm text-primary-foreground">C</span>
              </div>
            )}
            <span className="font-bold text-lg hidden sm:inline text-foreground">
              {locale === "vi" ? "CMS" : "CMS"}
            </span>
          </Link>

          <nav className="hidden md:flex gap-1">
            {menu?.items?.map((item) => {
              const label = item?.label ? (typeof item.label === "object" ? (item.label[locale] || item.label.en || "Menu Item") : item.label) : "Menu Item"
              return (
                <Link
                  key={item.id}
                  href={item.is_external ? item.url : `/${locale}${item.url}`}
                  target={item.is_external ? "_blank" : undefined}
                  rel={item.is_external ? "noopener noreferrer" : undefined}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all duration-200"
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <MobileMenu menu={menu} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  )
}

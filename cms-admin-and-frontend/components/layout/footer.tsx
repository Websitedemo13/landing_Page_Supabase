"use client"

import type React from "react"

import Link from "next/link"
import type { Menu } from "@/types/cms"
import type { SiteConfig } from "@/types/cms"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

interface FooterProps {
  menu: Menu | null
  siteConfig: SiteConfig | null
  locale: string
}

const socialIcons: Record<string, React.ComponentType<{ className: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
}

export function Footer({ menu, siteConfig, locale }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">{locale === "vi" ? "Menu" : "Menu"}</h3>
            <nav className="flex flex-col gap-2">
              {menu?.items?.map((item) => (
                <Link
                  key={item.id}
                  href={item.is_external ? item.url : `/${locale}${item.url}`}
                  target={item.is_external ? "_blank" : undefined}
                  className="text-foreground/60 hover:text-foreground transition-colors duration-200 text-sm"
                >
                  {item.label[locale] || item.label.en}
                </Link>
              ))}
            </nav>
          </div>

          {siteConfig?.social_links && Object.keys(siteConfig.social_links).length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4">{locale === "vi" ? "Theo dõi chúng tôi" : "Follow Us"}</h3>
              <div className="flex gap-4 flex-wrap">
                {Object.entries(siteConfig.social_links).map(([key, url]) => {
                  const Icon = socialIcons[key.toLowerCase()]
                  return (
                    <a
                      key={key}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-foreground transition-colors duration-200"
                    >
                      {Icon ? <Icon className="w-5 h-5" /> : <span className="text-sm capitalize">{key}</span>}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-4">{locale === "vi" ? "Thông tin" : "Information"}</h3>
            <p className="text-foreground/60 text-sm">
              {locale === "vi" ? "Một trang web được xây dựng bằng CMS mạnh mẽ" : "A website built with a powerful CMS"}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-foreground/60 text-sm">
            <p>&copy; 2026 {locale === "vi" ? "Tất cả các quyền được bảo lưu." : "All rights reserved."}</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link href={`/${locale}`} className="hover:text-foreground transition-colors duration-200">
                {locale === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}
              </Link>
              <Link href={`/${locale}`} className="hover:text-foreground transition-colors duration-200">
                {locale === "vi" ? "Điều khoản dịch vụ" : "Terms of Service"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

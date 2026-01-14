"use client"

import { usePathname, useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface LanguageSwitcherProps {
  currentLocale: string
}

const languages = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
]

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleLanguageChange(locale: string) {
    const pathSegments = pathname.split("/")
    pathSegments[1] = locale
    const newPath = pathSegments.join("/")
    router.push(newPath)
    setIsOpen(false)
  }

  const currentLanguage = languages.find((lang) => lang.code === currentLocale)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage?.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-50 animate-slide-in-up">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                currentLocale === lang.code
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
            >
              {lang.code === "en" ? "🇺🇸 English" : "🇻🇳 Tiếng Việt"}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

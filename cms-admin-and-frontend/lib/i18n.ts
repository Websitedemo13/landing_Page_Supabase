export const locales = ["vi", "en"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const translations = {
  vi: {
    common: {
      home: "Trang chủ",
      about: "Giới thiệu",
      contact: "Liên hệ",
      menu: "Menu",
      search: "Tìm kiếm",
      language: "Ngôn ngữ",
    },
  },
  en: {
    common: {
      home: "Home",
      about: "About",
      contact: "Contact",
      menu: "Menu",
      search: "Search",
      language: "Language",
    },
  },
}

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".")
  let value: any = translations[locale]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

"use client"

import type { Page } from "@/types/cms"
import { deletePage } from "@/lib/cms"
import { Trash2, FileText } from "lucide-react"

interface PageManagerProps {
  pages: Page[]
  selectedPageId: string | null
  onSelectPage: (id: string) => void
  onPageUpdated: () => void
  loading: boolean
}

export function PageManager({ pages, selectedPageId, onSelectPage, onPageUpdated, loading }: PageManagerProps) {
  async function handleDelete(pageId: string) {
    if (confirm("Are you sure you want to delete this page?")) {
      await deletePage(pageId)
      onPageUpdated()
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-muted-foreground border border-gray-200 dark:border-gray-700 animate-pulse">
        Loading pages...
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-muted/5">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Pages ({pages.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`p-4 cursor-pointer flex justify-between items-center hover:bg-muted/5 transition ${
              selectedPageId === page.id ? "bg-primary/10 border-l-4 border-primary" : ""
            }`}
          >
            <div onClick={() => onSelectPage(page.id)} className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">{page.slug}</p>
              <p className="text-sm text-muted-foreground">
                {page.title.vi} / {page.title.en}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{page.is_published ? "✓ Published" : "Draft"}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(page.id)
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

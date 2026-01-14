"use client"

import { useState, useEffect } from "react"
import { getAllPages, createPage } from "@/lib/cms"
import { createClient } from "@/lib/supabase/client"
import { PageManager } from "@/components/admin/page-manager"
import { FooterManager } from "@/components/admin/footer-manager"
import type { Page } from "@/types/cms"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [pages, setPages] = useState<Page[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState("")
  const [titleVi, setTitleVi] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [activeTab, setActiveTab] = useState<"pages" | "footer">("pages")
  const router = useRouter()

  useEffect(() => {
    loadPages()
  }, [])

  async function loadPages() {
    setLoading(true)
    const { data } = await getAllPages()
    if (data) setPages(data)
    setLoading(false)
  }

  async function handleCreatePage() {
    if (!slug || !titleVi || !titleEn) {
      alert("Please fill in all fields")
      return
    }

    const { error } = await createPage({
      slug,
      title: { vi: titleVi, en: titleEn },
      is_published: false,
    })

    if (error) {
      console.error(error)
      alert("Error creating page")
    } else {
      setSlug("")
      setTitleVi("")
      setTitleEn("")
      setIsCreating(false)
      loadPages()
    }
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CMS Admin</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your dynamic website content</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("pages")}
              className={`flex-1 py-3 px-6 font-medium transition ${
                activeTab === "pages"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Pages & Sections
            </button>
            <button
              onClick={() => setActiveTab("footer")}
              className={`flex-1 py-3 px-6 font-medium transition ${
                activeTab === "footer"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Footer & Social Links
            </button>
          </div>
        </div>

        {/* Pages Tab */}
        {activeTab === "pages" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {isCreating && (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 animate-slide-in-right">
                <h2 className="text-xl font-semibold mb-4">Create New Page</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Page Slug</label>
                    <input
                      type="text"
                      placeholder="e.g., home, about, contact"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title (VI)</label>
                    <input
                      type="text"
                      placeholder="Tiêu đề tiếng Việt"
                      value={titleVi}
                      onChange={(e) => setTitleVi(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title (EN)</label>
                    <input
                      type="text"
                      placeholder="English title"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>
                  <button
                    onClick={handleCreatePage}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                  >
                    Create Page
                  </button>
                </div>
              </div>
            )}

            <PageManager
              pages={pages}
              selectedPageId={selectedPageId}
              onSelectPage={setSelectedPageId}
              onPageUpdated={loadPages}
              loading={loading}
            />
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === "footer" && (
          <div className="p-6">
            <FooterManager onUpdated={() => {}} />
          </div>
        )}
      </div>
    </div>
  )
}

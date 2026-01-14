"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Eye, EyeOff, GripVertical, Edit2 } from "lucide-react"

interface FooterSection {
  id: string
  title: Record<string, string>
  description: Record<string, string>
  column_position: number
  sort_order: number
  is_visible: boolean
}

interface SocialLink {
  id: string
  platform: string
  url: string
  icon_type: string
  sort_order: number
  is_visible: boolean
}

interface FooterManagerProps {
  onUpdated: () => void
}

export function FooterManager({ onUpdated }: FooterManagerProps) {
  const supabase = createClient()
  const [footerSections, setFooterSections] = useState<FooterSection[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [activeTab, setActiveTab] = useState<"sections" | "social">("sections")
  const [loading, setLoading] = useState(true)

  // Footer Section Form State
  const [editingSection, setEditingSection] = useState<FooterSection | null>(null)
  const [sectionTitleVi, setSectionTitleVi] = useState("")
  const [sectionTitleEn, setSectionTitleEn] = useState("")
  const [sectionDescVi, setSectionDescVi] = useState("")
  const [sectionDescEn, setSectionDescEn] = useState("")

  // Social Link Form State
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null)
  const [socialPlatform, setSocialPlatform] = useState("")
  const [socialUrl, setSocialUrl] = useState("")

  useEffect(() => {
    loadFooterData()
  }, [])

  async function loadFooterData() {
    setLoading(true)
    const [sectionsResult, socialResult] = await Promise.all([
      supabase.from("footer_sections").select("*").order("sort_order"),
      supabase.from("social_links").select("*").order("sort_order"),
    ])

    if (sectionsResult.data) setFooterSections(sectionsResult.data)
    if (socialResult.data) setSocialLinks(socialResult.data)
    setLoading(false)
  }

  async function handleSaveSection() {
    if (!sectionTitleVi || !sectionTitleEn) {
      alert("Please fill in all required fields")
      return
    }

    const payload = {
      title: { vi: sectionTitleVi, en: sectionTitleEn },
      description: { vi: sectionDescVi, en: sectionDescEn },
    }

    if (editingSection) {
      await supabase.from("footer_sections").update(payload).eq("id", editingSection.id)
    } else {
      await supabase.from("footer_sections").insert([
        {
          ...payload,
          sort_order: footerSections.length,
          is_visible: true,
        },
      ])
    }

    resetSectionForm()
    loadFooterData()
  }

  async function handleDeleteSection(id: string) {
    if (confirm("Delete this section?")) {
      await supabase.from("footer_sections").delete().eq("id", id)
      loadFooterData()
    }
  }

  async function handleToggleSectionVisibility(id: string, visible: boolean) {
    await supabase.from("footer_sections").update({ is_visible: !visible }).eq("id", id)
    loadFooterData()
  }

  async function handleSaveSocial() {
    if (!socialPlatform || !socialUrl) {
      alert("Please fill in all required fields")
      return
    }

    const payload = { platform: socialPlatform, url: socialUrl }

    if (editingSocial) {
      await supabase.from("social_links").update(payload).eq("id", editingSocial.id)
    } else {
      await supabase.from("social_links").insert([
        {
          ...payload,
          sort_order: socialLinks.length,
          is_visible: true,
        },
      ])
    }

    resetSocialForm()
    loadFooterData()
  }

  async function handleDeleteSocial(id: string) {
    if (confirm("Delete this social link?")) {
      await supabase.from("social_links").delete().eq("id", id)
      loadFooterData()
    }
  }

  async function handleToggleSocialVisibility(id: string, visible: boolean) {
    await supabase.from("social_links").update({ is_visible: !visible }).eq("id", id)
    loadFooterData()
  }

  function resetSectionForm() {
    setEditingSection(null)
    setSectionTitleVi("")
    setSectionTitleEn("")
    setSectionDescVi("")
    setSectionDescEn("")
  }

  function resetSocialForm() {
    setEditingSocial(null)
    setSocialPlatform("")
    setSocialUrl("")
  }

  function editSection(section: FooterSection) {
    setEditingSection(section)
    setSectionTitleVi(section.title.vi || "")
    setSectionTitleEn(section.title.en || "")
    setSectionDescVi(section.description?.vi || "")
    setSectionDescEn(section.description?.en || "")
  }

  function editSocial(social: SocialLink) {
    setEditingSocial(social)
    setSocialPlatform(social.platform)
    setSocialUrl(social.url)
  }

  if (loading) {
    return <div className="text-center py-8">Loading footer settings...</div>
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("sections")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "sections"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
          }`}
        >
          Footer Sections
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "social"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
          }`}
        >
          Social Links
        </button>
      </div>

      {/* Footer Sections Tab */}
      {activeTab === "sections" && (
        <div className="space-y-6">
          {/* Form */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              {editingSection ? "Edit Footer Section" : "Add Footer Section"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title (VI)</label>
                  <input
                    type="text"
                    value={sectionTitleVi}
                    onChange={(e) => setSectionTitleVi(e.target.value)}
                    placeholder="Tiêu đề tiếng Việt"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title (EN)</label>
                  <input
                    type="text"
                    value={sectionTitleEn}
                    onChange={(e) => setSectionTitleEn(e.target.value)}
                    placeholder="English title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Description (VI)</label>
                  <textarea
                    value={sectionDescVi}
                    onChange={(e) => setSectionDescVi(e.target.value)}
                    placeholder="Mô tả"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (EN)</label>
                  <textarea
                    value={sectionDescEn}
                    onChange={(e) => setSectionDescEn(e.target.value)}
                    placeholder="Description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveSection}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {editingSection ? "Update Section" : "Add Section"}
                </button>
                {editingSection && (
                  <button
                    onClick={resetSectionForm}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-3">
            {footerSections.map((section) => (
              <div
                key={section.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition"
              >
                <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{section.title.vi}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{section.title.en}</p>
                </div>
                <button
                  onClick={() => editSection(section)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleSectionVisibility(section.id, section.is_visible)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition"
                >
                  {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === "social" && (
        <div className="space-y-6">
          {/* Form */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">{editingSocial ? "Edit Social Link" : "Add Social Link"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select platform...</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter (X)</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveSocial}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {editingSocial ? "Update Link" : "Add Link"}
                </button>
                {editingSocial && (
                  <button
                    onClick={resetSocialForm}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Social Links List */}
          <div className="space-y-3">
            {socialLinks.map((social) => (
              <div
                key={social.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition"
              >
                <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{social.platform}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{social.url}</p>
                </div>
                <button onClick={() => editSocial(social)} className="p-2 text-gray-500 hover:text-blue-600 transition">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleSocialVisibility(social.id, social.is_visible)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition"
                >
                  {social.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDeleteSocial(social.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

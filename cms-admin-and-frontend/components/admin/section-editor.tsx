"use client"

import { useState, useEffect } from "react"
import type { PageSection } from "@/types/cms"
import { updatePageSection } from "@/lib/cms"
import { ImageUploader } from "@/components/cms/image-uploader"
import { SectionPreview } from "./section-preview"
import { LayoutGrid, Settings2, EyeIcon } from "lucide-react"

interface SectionEditorProps {
  sectionId: string
  sections: PageSection[]
  onSectionUpdated: () => void
}

const LAYOUT_PRESETS = {
  hero: [
    { id: "full", label: "Full Screen", variant: "full", description: "Full height background image with overlay" },
    { id: "split", label: "Split Layout", variant: "split", description: "Image on one side, content on other" },
    { id: "minimal", label: "Minimal", variant: "minimal", description: "Clean, simple text-only layout" },
    {
      id: "gradient",
      label: "Gradient",
      variant: "gradient",
      description: "Beautiful gradient background with content",
    },
    { id: "card", label: "Card Style", variant: "card", description: "Centered card with shadow and spacing" },
  ],
  grid: [
    { id: 3, label: "3 Columns", columns: 3, description: "Perfect for most designs" },
    { id: 4, label: "4 Columns", columns: 4, description: "Compact grid layout" },
    { id: 5, label: "5 Columns", columns: 5, description: "Wide, detailed grid" },
    { id: "2x3", label: "2x3 Masonry", columns: "2x3", description: "Alternating row heights" },
    { id: "feature", label: "Feature Grid", columns: "feature", description: "Large featured item + grid" },
  ],
  content: [
    { id: "standard", label: "Standard", layout: "standard", description: "Regular content layout" },
    { id: "two-col", label: "Two Column", layout: "two-col", description: "Two column content" },
    { id: "sidebar", label: "With Sidebar", layout: "sidebar", description: "Content with sidebar" },
  ],
}

export function SectionEditor({ sectionId, sections, onSectionUpdated }: SectionEditorProps) {
  const section = sections.find((s) => s.id === sectionId)
  const [content, setContent] = useState(section?.content || { vi: {}, en: {} })
  const [layoutConfig, setLayoutConfig] = useState(section?.layout_config || {})
  const [saving, setSaving] = useState(false)
  const [expandedTab, setExpandedTab] = useState<"vi" | "en">("vi")
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewLocale, setPreviewLocale] = useState<"vi" | "en">("vi")

  useEffect(() => {
    if (section) {
      setContent(section.content)
      setLayoutConfig(section.layout_config)
    }
  }, [sectionId, section])

  async function handleSave() {
    setSaving(true)
    await updatePageSection(sectionId, {
      content,
      layout_config: layoutConfig,
    })
    setSaving(false)
    onSectionUpdated()
  }

  function updateContent(lang: "vi" | "en", updates: Record<string, any>) {
    setContent({
      ...content,
      [lang]: {
        ...content[lang],
        ...updates,
      },
    })
  }

  function applyPreset(preset: any) {
    const newConfig = { ...layoutConfig }
    if (preset.variant !== undefined) newConfig.variant = preset.variant
    if (preset.columns !== undefined) newConfig.columns = preset.columns
    if (preset.layout !== undefined) newConfig.layout = preset.layout
    setLayoutConfig(newConfig)
    setSelectedPreset(preset.id)
  }

  if (!section) {
    return null
  }

  const presets = LAYOUT_PRESETS[section.type as keyof typeof LAYOUT_PRESETS] || []

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Edit {section.type.toUpperCase()} Section</h3>
        {/* Preview Button */}
        <button
          onClick={() => {
            setPreviewLocale(expandedTab)
            setShowPreview(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <EyeIcon className="w-4 h-4" />
          Preview
        </button>
      </div>

      <div className="space-y-6">
        {/* Layout Presets */}
        {presets.length > 0 && (
          <div className="border-b pb-6">
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Layout Presets</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`p-3 rounded-lg border-2 transition text-left ${
                    selectedPreset === preset.id
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{preset.label}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Layout Configuration */}
        {section.type === "hero" && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Image Position
              </label>
              <select
                value={layoutConfig.imagePosition || "right"}
                onChange={(e) =>
                  setLayoutConfig({
                    ...layoutConfig,
                    imagePosition: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="background">Background</option>
              </select>
            </div>
          </>
        )}

        {section.type === "grid" && (
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Column Count
            </label>
            <select
              value={layoutConfig.columns || 3}
              onChange={(e) => setLayoutConfig({ ...layoutConfig, columns: Number.parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
              <option value={5}>5 Columns</option>
            </select>
          </div>
        )}

        {/* Content Tabs */}
        <div>
          <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setExpandedTab("vi")}
              className={`px-4 py-2 font-medium transition ${
                expandedTab === "vi"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Vietnamese (VI)
            </button>
            <button
              onClick={() => setExpandedTab("en")}
              className={`px-4 py-2 font-medium transition ${
                expandedTab === "en"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              English (EN)
            </button>
          </div>

          {expandedTab === "vi" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-2">Title (VI)</label>
                <input
                  type="text"
                  value={content.vi?.title || ""}
                  onChange={(e) => updateContent("vi", { title: e.target.value })}
                  placeholder="Tiêu đề tiếng Việt"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (VI)</label>
                <textarea
                  value={content.vi?.description || ""}
                  onChange={(e) => updateContent("vi", { description: e.target.value })}
                  placeholder="Mô tả nội dung"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <ImageUploader
                currentImageUrl={content.vi?.imageUrl}
                currentImagePath={content.vi?.imagePath}
                onImageUploaded={(url, path) => updateContent("vi", { imageUrl: url, imagePath: path })}
                onImageDeleted={() => updateContent("vi", { imageUrl: null, imagePath: null })}
              />
              <div>
                <label className="block text-sm font-medium mb-2">JSON Content (Advanced)</label>
                <textarea
                  value={JSON.stringify(content.vi || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      setContent({ ...content, vi: JSON.parse(e.target.value) })
                    } catch {}
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 font-mono text-sm h-40 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {expandedTab === "en" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-2">Title (EN)</label>
                <input
                  type="text"
                  value={content.en?.title || ""}
                  onChange={(e) => updateContent("en", { title: e.target.value })}
                  placeholder="English title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (EN)</label>
                <textarea
                  value={content.en?.description || ""}
                  onChange={(e) => updateContent("en", { description: e.target.value })}
                  placeholder="Content description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <ImageUploader
                currentImageUrl={content.en?.imageUrl}
                currentImagePath={content.en?.imagePath}
                onImageUploaded={(url, path) => updateContent("en", { imageUrl: url, imagePath: path })}
                onImageDeleted={() => updateContent("en", { imageUrl: null, imagePath: null })}
              />
              <div>
                <label className="block text-sm font-medium mb-2">JSON Content (Advanced)</label>
                <textarea
                  value={JSON.stringify(content.en || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      setContent({ ...content, en: JSON.parse(e.target.value) })
                    } catch {}
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 font-mono text-sm h-40 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 shadow-md hover:shadow-lg"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && section && (
        <SectionPreview section={section} locale={previewLocale} onClose={() => setShowPreview(false)} />
      )}
    </div>
  )
}

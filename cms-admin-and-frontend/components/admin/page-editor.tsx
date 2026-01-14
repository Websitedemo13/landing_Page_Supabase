"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { PageSection } from "@/types/cms"
import {
  getAllPageSections,
  createPageSection,
  deletePageSection,
  updatePage,
  updateSectionVisibility,
  updateSectionOrder,
} from "@/lib/cms.client"
import { SectionEditor } from "./section-editor"
import { Plus, GripVertical, Trash2, Eye, EyeOff } from "lucide-react"

interface PageEditorProps {
  pageId: string
  onPageUpdated: () => void
}

export function PageEditor({ pageId, onPageUpdated }: PageEditorProps) {
  const [sections, setSections] = useState<PageSection[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newSectionType, setNewSectionType] = useState<string>("hero")
  const [loading, setLoading] = useState(true)
  const [isPublished, setIsPublished] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    loadSections()
  }, [pageId])

  async function loadSections() {
    setLoading(true)
    const { data } = await getAllPageSections(pageId)
    if (data) setSections(data)
    setLoading(false)
  }

  async function handleCreateSection() {
    const { error } = await createPageSection({
      page_id: pageId,
      type: newSectionType,
      layout_config: {},
      content: { vi: {}, en: {} },
      sort_order: sections.length,
      is_visible: true,
    })

    if (!error) {
      setNewSectionType("hero")
      setIsCreating(false)
      loadSections()
    }
  }

  async function handleDeleteSection(sectionId: string) {
    if (confirm("Delete this section?")) {
      await deletePageSection(sectionId)
      loadSections()
    }
  }

  async function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  async function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  async function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newSections = [...sections]
    const draggedSection = newSections[draggedIndex]
    newSections.splice(draggedIndex, 1)
    newSections.splice(dropIndex, 0, draggedSection)

    // Update sort_order for all sections
    for (let i = 0; i < newSections.length; i++) {
      await updateSectionOrder(newSections[i].id, i)
    }

    setSections(newSections)
    setDraggedIndex(null)
  }

  async function handleToggleVisibility(sectionId: string, currentVisibility: boolean) {
    await updateSectionVisibility(sectionId, !currentVisibility)
    loadSections()
  }

  async function handlePublish() {
    await updatePage(pageId, { is_published: !isPublished })
    setIsPublished(!isPublished)
    onPageUpdated()
  }

  if (loading) {
    return <div className="text-gray-500">Loading sections...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Page Sections</h2>
          <button
            onClick={handlePublish}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              isPublished ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-4">Add New Section</h3>
          <div className="flex gap-2">
            <select
              value={newSectionType}
              onChange={(e) => setNewSectionType(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="hero">Hero</option>
              <option value="grid">Grid</option>
              <option value="content">Content</option>
              <option value="faq">FAQ</option>
              <option value="cta">CTA</option>
            </select>
            <button
              onClick={handleCreateSection}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Add
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Section
        </button>
      )}

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`bg-white dark:bg-gray-900 rounded-lg shadow p-4 cursor-move flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition border border-gray-200 dark:border-gray-700 ${
              selectedSectionId === section.id ? "ring-2 ring-blue-500" : ""
            } ${draggedIndex !== null ? "opacity-50" : ""} ${!section.is_visible ? "opacity-60" : ""}`}
            onClick={() => setSelectedSectionId(section.id)}
          >
            <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">{section.type.toUpperCase()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Section {index + 1}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleToggleVisibility(section.id, section.is_visible)
              }}
              className="text-gray-500 hover:text-blue-600 transition p-2"
              title={section.is_visible ? "Hide section" : "Show section"}
            >
              {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteSection(section.id)
              }}
              className="text-red-500 hover:text-red-700 transition p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {selectedSectionId && (
        <SectionEditor sectionId={selectedSectionId} sections={sections} onSectionUpdated={loadSections} />
      )}
    </div>
  )
}

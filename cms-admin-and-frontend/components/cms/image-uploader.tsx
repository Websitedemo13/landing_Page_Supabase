"use client"

import type React from "react"

import { useState, useRef } from "react"
import { uploadImage, deleteImage } from "@/lib/supabase/storage"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  onImageUploaded?: (url: string, path: string) => void
  currentImageUrl?: string
  currentImagePath?: string
  onImageDeleted?: () => void
}

export function ImageUploader({
  onImageUploaded,
  currentImageUrl,
  currentImagePath,
  onImageDeleted,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setIsUploading(true)
    setError(null)

    const result = await uploadImage(file)
    setIsUploading(false)

    if (result.success) {
      console.log("[v0] Image uploaded:", result.url)
      onImageUploaded?.(result.url, result.path)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } else {
      setError(result.error || "Upload failed")
    }
  }

  async function handleDelete() {
    if (!currentImagePath) return

    setIsUploading(true)
    setError(null)

    const result = await deleteImage(currentImagePath)
    setIsUploading(false)

    if (result.success) {
      console.log("[v0] Image deleted:", currentImagePath)
      onImageDeleted?.()
    } else {
      setError(result.error || "Delete failed")
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Image</label>

        {currentImageUrl ? (
          <div className="relative inline-block">
            <img
              src={currentImageUrl || "/placeholder.svg"}
              alt="Preview"
              className="max-w-xs h-auto rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <button
              type="button"
              onClick={handleDelete}
              disabled={isUploading}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

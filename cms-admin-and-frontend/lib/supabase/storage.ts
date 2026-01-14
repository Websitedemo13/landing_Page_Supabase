import { createClient as createBrowserClient } from "@/lib/supabase/client"

const BUCKET_NAME = "cms-images"

export async function uploadImage(file: File, folder = "pages") {
  try {
    const supabase = createBrowserClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    }
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export async function deleteImage(filePath: string) {
  try {
    const supabase = createBrowserClient()
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    }
  }
}

export async function getPublicUrl(filePath: string) {
  const supabase = createBrowserClient()
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
  return data.publicUrl
}

"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import Image from "next/image"

export default function ImageSection({ 
    formData, 
    handleChange, 
    existingImages, 
    removeExistingImage, 
    handleNewImagesChange, 
    newImagesPreviews, 
    removeNewImage 
}) {
  return (
    <div className="space-y-6">
      {existingImages && existingImages.length > 0 && (
        <div>
          <Label>Existing Images</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
            {existingImages.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image.url}
                  alt={`Existing image ${index + 1}`}
                  width={150}
                  height={150}
                  className="h-32 w-full object-cover rounded-lg border shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="images-upload">Add New Images</Label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-xl bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer group">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-muted-foreground">
              <label
                htmlFor="images-upload"
                className="relative cursor-pointer bg-transparent rounded-md font-semibold text-primary hover:underline focus-within:outline-none"
              >
                <span>Upload images</span>
                <input
                  id="images-upload"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImagesChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>

      {newImagesPreviews && newImagesPreviews.length > 0 && (
        <div>
          <Label>New Image Previews</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
            {newImagesPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  width={150}
                  height={150}
                  className="h-32 w-full object-cover rounded-lg border shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="videoUrl">Videos Url (YouTube, etc.)</Label>
        <Input
          name="videoUrl"
          id="videoUrl"
          type="text"
          value={formData.videoUrl}
          onChange={handleChange}
          placeholder="Enter video URL"
          className="mt-1"
        />
      </div>
    </div>
  )
}

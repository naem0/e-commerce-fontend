"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
} from "lucide-react"

export default function RichTextEditor({ value = "", onChange, placeholder = "Enter description..." }) {
  const editorRef = useRef(null)
  const imageInputRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      if (onChange) {
        onChange(newContent)
      }
    }
  }

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleContentChange()
  }

  const insertLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  // Trigger the hidden file input
  const insertImage = () => {
    imageInputRef.current?.click()
  }

  // Handle local file selected from disk — embed as base64 data URL
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      editorRef.current?.focus()
      document.execCommand("insertImage", false, ev.target.result)
      handleContentChange()
    }
    reader.readAsDataURL(file)
    // Reset so the same file can be re-selected
    e.target.value = ""
  }

  const changeFontSize = (size) => {
    execCommand("fontSize", size)
  }

  const changeTextColor = (color) => {
    execCommand("foreColor", color)
  }

  const changeBackgroundColor = (color) => {
    execCommand("hiliteColor", color)
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="border-b p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => execCommand("bold")} className="h-8 w-8 p-0">
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("italic")}
              className="h-8 w-8 p-0"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("underline")}
              className="h-8 w-8 p-0"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          {/* Font Size */}
          <div className="flex gap-1 border-border border-r pr-2 mr-2">
            <select
              onChange={(e) => changeFontSize(e.target.value)}
              className="text-sm border border-border rounded px-3 py-1 h-8 bg-background text-foreground outline-none cursor-pointer appearance-none pr-8 dark:bg-zinc-900 transition-colors hover:border-primary/50"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
              defaultValue="3"
            >
              <option value="1" className="bg-background">Small</option>
              <option value="3" className="bg-background">Normal</option>
              <option value="5" className="bg-background">Large</option>
              <option value="7" className="bg-background">Extra Large</option>
            </select>
          </div>

          {/* Text Alignment */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("justifyLeft")}
              className="h-8 w-8 p-0"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("justifyCenter")}
              className="h-8 w-8 p-0"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("justifyRight")}
              className="h-8 w-8 p-0"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("insertUnorderedList")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand("insertOrderedList")}
              className="h-8 w-8 p-0"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          {/* Links and Images */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button type="button" variant="ghost" size="sm" onClick={insertLink} className="h-8 w-8 p-0" title="Insert Link">
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={insertImage} className="h-8 w-8 p-0" title="Insert Image from device">
              <ImageIcon className="h-4 w-4" />
            </Button>
            {/* Hidden file input for image upload */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />
          </div>

          {/* Colors */}
          <div className="flex gap-1">
            <input
              type="color"
              onChange={(e) => changeTextColor(e.target.value)}
              className="w-8 h-8 border rounded cursor-pointer"
              title="Text Color"
            />
            <input
              type="color"
              onChange={(e) => changeBackgroundColor(e.target.value)}
              className="w-8 h-8 border rounded cursor-pointer"
              title="Background Color"
            />
          </div>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          onBlur={handleContentChange}
          className="min-h-[200px] p-4 focus:outline-none"
          style={{ wordWrap: "break-word" }}
          data-placeholder={placeholder}
        />
      </CardContent>
    </Card>
  )
}

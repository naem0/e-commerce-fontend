"use client"

import { useState, useRef, useEffect } from "react"
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
  const [content, setContent] = useState(value)
  const editorRef = useRef(null)

  useEffect(() => {
    if (value !== content) {
      setContent(value)
      if (editorRef.current) {
        editorRef.current.innerHTML = value
      }
    }
  }, [value])

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setContent(newContent)
      onChange?.(newContent)
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

  const insertImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      execCommand("insertImage", url)
    }
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
          <div className="flex gap-1 border-r pr-2 mr-2">
            <select onChange={(e) => changeFontSize(e.target.value)} className="text-sm border rounded px-2 py-1 h-8">
              <option value="1">Small</option>
              <option value="3" selected>
                Normal
              </option>
              <option value="5">Large</option>
              <option value="7">Extra Large</option>
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
            <Button type="button" variant="ghost" size="sm" onClick={insertLink} className="h-8 w-8 p-0">
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={insertImage} className="h-8 w-8 p-0">
              <ImageIcon className="h-4 w-4" />
            </Button>
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
          dangerouslySetInnerHTML={{ __html: content }}
          data-placeholder={placeholder}
        />
      </CardContent>
    </Card>
  )
}

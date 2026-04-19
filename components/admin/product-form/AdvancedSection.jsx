"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search } from "lucide-react"

export default function AdvancedSection({ formData, handleChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 outline-none">
      {/* SEO Section */}
      <Card className="border-border shadow-sm bg-card/50">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search Engine Optimization (SEO)
          </CardTitle>
          <p className="text-sm text-muted-foreground">Improve your product's visibility on search engines</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="seo-title">SEO Meta Title</Label>
            <Input
              id="seo-title"
              name="seo.title"
              value={formData.seo?.title || ""}
              onChange={handleChange}
              placeholder="Recommended: 50-60 characters"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-description">SEO Meta Description</Label>
            <Textarea
              id="seo-description"
              name="seo.description"
              value={formData.seo?.description || ""}
              onChange={handleChange}
              placeholder="Summary for search results (max 160 characters)"
              rows={4}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-keywords">Meta Keywords</Label>
            <Input
              id="seo-keywords"
              name="seo.keywords"
              value={formData.seo?.keywords || ""}
              onChange={handleChange}
              placeholder="keyword1, keyword2, keyword3"
              className="bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Internal Notes / Meta */}
      <Card className="border-border shadow-sm bg-card/50">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-xl">Additional Meta Data</CardTitle>
          <p className="text-sm text-muted-foreground">Extra information for system or internal use</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20 italic text-sm text-primary">
            "SEO title and description are critical for ranking your product on Google and other search engines. Make them compelling to increase clicks!"
          </div>
          <div className="pt-4 flex items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl">
             <Label className="text-muted-foreground font-medium italic">Additional system-level fields can be integrated here...</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { Textarea } from "@/components/ui/textarea"

export default function AdditionalDetailsStep({ formData, onChange, onRichTextChange }) {
    const tags = formData.tags?.join(", ") || ""

    const handleTagsChange = (e) => {
        const tagsArray = e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)
        onChange({ target: { name: "tags", value: tagsArray } })
    }

    return (
        <div className="space-y-6">
            {/* Specification */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="specification">Product Specifications (Optional)</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Add detailed product specifications
                        </p>
                        <RichTextEditor
                            value={formData.specification}
                            onChange={(value) => onRichTextChange("specification", value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Tags */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="tags">Product Tags (Optional)</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Add tags separated by commas (e.g., electronics, smartphone, android)
                        </p>
                        <Input
                            id="tags"
                            value={tags}
                            onChange={handleTagsChange}
                            placeholder="tag1, tag2, tag3"
                        />
                        {formData.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* SEO */}
            <Card>
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">SEO Settings (Optional)</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="seoTitle">SEO Title</Label>
                            <Input
                                id="seoTitle"
                                value={formData.seo?.title || ""}
                                onChange={(e) => onChange({
                                    target: {
                                        name: "seo",
                                        value: { ...formData.seo, title: e.target.value }
                                    }
                                })}
                                placeholder="Optimized title for search engines"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seoDescription">SEO Description</Label>
                            <Textarea
                                id="seoDescription"
                                value={formData.seo?.description || ""}
                                onChange={(e) => onChange({
                                    target: {
                                        name: "seo",
                                        value: { ...formData.seo, description: e.target.value }
                                    }
                                })}
                                placeholder="Brief description for search engine results"
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">
                                {formData.seo?.description?.length || 0} / 160 characters (recommended)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

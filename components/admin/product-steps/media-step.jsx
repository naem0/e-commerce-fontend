"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Upload } from "lucide-react"
import Image from "next/image"

export default function MediaStep({ formData, images, videoUrl, onImagesChange, onRemoveImage, onVideoUrlChange }) {
    return (
        <div className="space-y-6">
            {/* Product Images */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="images">Product Images</Label>
                            <p className="text-sm text-muted-foreground mb-2">
                                Upload product images (maximum 5 images, first image will be the main image)
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-square border-2 border-dashed rounded-lg overflow-hidden">
                                        <Image
                                            src={image.preview}
                                            alt={`Product ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => onRemoveImage(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    {index === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs text-center py-1">
                                            Main Image
                                        </div>
                                    )}
                                </div>
                            ))}

                            {images.length < 5 && (
                                <label
                                    htmlFor="images"
                                    className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                >
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Upload Image</span>
                                    <Input
                                        id="images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={onImagesChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {images.length === 0 && (
                            <p className="text-sm text-amber-600">⚠️ At least one product image is recommended</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Video URL */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="videoUrl">Product Video (Optional)</Label>
                            <p className="text-sm text-muted-foreground mb-2">
                                Add a YouTube video URL to showcase your product
                            </p>
                        </div>

                        <Input
                            id="videoUrl"
                            name="videoUrl"
                            value={videoUrl}
                            onChange={onVideoUrlChange}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />

                        {videoUrl && (
                            <div className="aspect-video border rounded-lg overflow-hidden">
                                <iframe
                                    src={videoUrl.includes("youtube.com")
                                        ? videoUrl.replace("watch?v=", "embed/").split("&")[0]
                                        : videoUrl.includes("youtu.be")
                                            ? `https://www.youtube.com/embed/${videoUrl.split("/").pop()}`
                                            : ""
                                    }
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

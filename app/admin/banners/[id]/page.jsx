"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ImageIcon, ArrowLeft, Edit, Trash2 } from "lucide-react"
import { getBanner, deleteBanner } from "@/services/banner.service"
import { useToast } from "@/hooks/use-toast"

export default function ViewBannerPage({ params }) {
  const { id } = params
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [banner, setBanner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/admin/banners")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/")
    }
<<<<<<< HEAD
  }, [status, router])
=======
  }, [status, session, router])
>>>>>>> deb65d4920e3458694b3a9a4b2e330575dad9038

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getBanner(id)
        if (result.success) {
          setBanner(result.banner)
        } else {
          throw new Error(result.message || "Failed to fetch banner")
        }
      } catch (error) {
        console.error("Error fetching banner:", error)
        setError("Failed to load banner. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load banner",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "admin" && id) {
      fetchBanner()
    }
<<<<<<< HEAD
  }, [id, status, toast])
=======
  }, [id, status, session, toast])
>>>>>>> deb65d4920e3458694b3a9a4b2e330575dad9038

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      setLoading(true)
      const result = await deleteBanner(id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Banner deleted successfully",
        })
        router.push("/admin/banners")
      } else {
        throw new Error(result.message || "Failed to delete banner")
      }
    } catch (error) {
      console.error("Error deleting banner:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!banner) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Banner not found</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/admin/banners")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Banners
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ImageIcon className="w-8 h-8" />
            Banner Details
          </h1>
          <p className="text-muted-foreground">View banner information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/banners")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Banners
          </Button>
          <Button variant="outline" onClick={() => router.push(`/admin/banners/edit/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Banner Preview</CardTitle>
            <CardDescription>How the banner appears on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: banner.backgroundColor || "#f8fafc" }}
            >
              <div className="relative aspect-[2/1] w-full">
                <img
                  src={
                    banner.image.startsWith("/") ? `${process.env.NEXT_PUBLIC_API_URL}${banner.image}` : banner.image
                  }
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=300&width=600"
                  }}
                />
              </div>
              <div className="p-4" style={{ color: banner.textColor || "#1e293b" }}>
                <h3 className="text-xl font-bold">{banner.title}</h3>
                {banner.subtitle && <p className="text-lg opacity-90">{banner.subtitle}</p>}
                {banner.description && <p className="mt-2 opacity-80">{banner.description}</p>}
                <div className="mt-4">
                  <span
                    className="inline-block px-4 py-2 rounded-md font-medium"
                    style={{
                      backgroundColor: banner.textColor || "#1e293b",
                      color: banner.backgroundColor || "#f8fafc",
                    }}
                  >
                    {banner.buttonText || "Shop Now"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banner Information</CardTitle>
            <CardDescription>Details about this banner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <Badge variant={banner.enabled ? "success" : "secondary"} className="mt-1">
                {banner.enabled ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="mt-1">{banner.title}</p>
            </div>

            {banner.subtitle && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Subtitle</h3>
                <p className="mt-1">{banner.subtitle}</p>
              </div>
            )}

            {banner.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{banner.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Button</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm px-2 py-1 bg-gray-100 rounded-md">{banner.buttonText || "Shop Now"}</span>
                <span className="text-xs text-gray-500">→</span>
                <span className="text-sm text-blue-500">{banner.buttonLink || "/products"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Background Color</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-6 h-6 rounded-md border border-gray-200"
                    style={{ backgroundColor: banner.backgroundColor || "#f8fafc" }}
                  ></div>
                  <span>{banner.backgroundColor || "#f8fafc"}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Text Color</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-6 h-6 rounded-md border border-gray-200"
                    style={{ backgroundColor: banner.textColor || "#1e293b" }}
                  ></div>
                  <span>{banner.textColor || "#1e293b"}</span>
                </div>
              </div>
            </div>

            {banner.createdAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p className="mt-1">{new Date(banner.createdAt).toLocaleString()}</p>
              </div>
            )}

            {banner.updatedAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1">{new Date(banner.updatedAt).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

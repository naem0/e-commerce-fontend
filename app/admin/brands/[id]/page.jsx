"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { brandService } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, AlertTriangle, ExternalLink } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BrandDetailsPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await brandService.getBrand(id)
        setBrand(response.brand)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching brand:", error)
        setError("Failed to load brand details. Please try again.")
        setLoading(false)
      }
    }

    fetchBrand()
  }, [id])

  const handleDelete = async () => {
    try {
      await brandService.deleteBrand(id)
      router.push("/admin/brands")
    } catch (error) {
      console.error("Error deleting brand:", error)
      setError("Failed to delete brand. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Brand not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The brand you are looking for does not exist or has been removed.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/admin/brands")}>Back to Brands</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Brand Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            {brand.logo ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${brand.logo}`}
                alt={brand.name}
                width={300}
                height={300}
                className="rounded-md object-cover w-full"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                No logo available
              </div>
            )}
          </div>

          <div className="md:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{brand.name}</h2>
                <div className="mt-1">
                  <Badge variant={brand.status === "active" ? "success" : "secondary"}>{brand.status}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/admin/brands/edit/${brand._id}`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {brand.website && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Website</h3>
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center text-blue-600 hover:underline"
                  >
                    {brand.website}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{brand.description || "No description provided."}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                <p className="mt-1">{new Date(brand.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1">{new Date(brand.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the brand &quot;{brand.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

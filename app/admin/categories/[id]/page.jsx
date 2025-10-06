"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { deleteCategory, getCategory } from "@/services/category.service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, AlertTriangle } from "lucide-react"
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

export default function CategoryDetailsPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategory(id)
        setCategory(response.category)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching category:", error)
        setError("Failed to load category details. Please try again.")
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  const handleDelete = async () => {
    try {
      await deleteCategory(id)
      router.push("/admin/categories")
    } catch (error) {
      console.error("Error deleting category:", error)
      setError("Failed to delete category. Please try again.")
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

  if (!category) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Category not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The category you are looking for does not exist or has been removed.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/admin/categories")}>Back to Categories</Button>
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
        <h1 className="text-2xl font-bold">Category Details</h1>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            {category.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${category.image}`}
                alt={category.name}
                width={300}
                height={300}
                className="rounded-md object-cover w-full"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>

          <div className="md:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{category.name}</h2>
                <div className="mt-1">
                  <Badge variant={category.status === "active" ? "success" : "secondary"}>{category.status}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/categories/edit/${category._id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {/* <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button> */}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Parent Category</h3>
                <p className="mt-1">{category.parent ? category.parent.name : "None (Top Level Category)"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{category.description || "No description provided."}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                <p className="mt-1">{new Date(category.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1">{new Date(category.updatedAt).toLocaleString()}</p>
              </div>

              {category.subcategories && category.subcategories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subcategories</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {category.subcategories.map((subcategory) => (
                      <Badge
                        key={subcategory._id}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => router.push(`/admin/categories/${subcategory._id}`)}
                      >
                        {subcategory.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category &quot;{category.name}&quot;. This action cannot be undone.
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

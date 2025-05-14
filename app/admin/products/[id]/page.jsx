"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { productService } from "@/services/api"
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

export default function ProductDetailsPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProduct(id)
        setProduct(response.product)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product details. Please try again.")
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleDelete = async () => {
    try {
      await productService.deleteProduct(id)
      router.push("/admin/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      setError("Failed to delete product. Please try again.")
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
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

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Product not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The product you are looking for does not exist or has been removed.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/admin/products")}>Back to Products</Button>
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
        <h1 className="text-2xl font-bold">Product Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            {product.images && product.images.length > 0 ? (
              <div className="space-y-2">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="rounded-md object-cover w-full"
                />
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1).map((image, index) => (
                      <Image
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                        alt={`${product.name} ${index + 2}`}
                        width={100}
                        height={100}
                        className="rounded-md object-cover w-full h-20"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>

          <div className="md:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{product.name}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant={
                      product.status === "published"
                        ? "success"
                        : product.status === "draft"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {product.status}
                  </Badge>
                  {product.featured && (
                    <Badge variant="outline" className="bg-yellow-100">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/admin/products/edit/${product._id}`)}>
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
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
                    {product.comparePrice > 0 && (
                      <p className="text-sm text-gray-500 line-through">{formatPrice(product.comparePrice)}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                  <p className="text-lg font-semibold">{product.stock} units</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1">{product.category.name}</p>
              </div>

              {product.brand && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                  <div className="mt-1 flex items-center gap-2">
                    {product.brand.logo && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${product.brand.logo}`}
                        alt={product.brand.name}
                        width={24}
                        height={24}
                        className="rounded-md object-contain"
                      />
                    )}
                    <span>{product.brand.name}</span>
                    {product.brand.website && (
                      <a
                        href={product.brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 whitespace-pre-line">{product.description}</p>
              </div>

              {product.sku && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">SKU</h3>
                  <p className="mt-1">{product.sku}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.weight && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                    <p className="mt-1">{product.weight} kg</p>
                  </div>
                )}

                {product.dimensions &&
                  (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Dimensions (L × W × H)</h3>
                      <p className="mt-1">
                        {product.dimensions.length || "0"} × {product.dimensions.width || "0"} ×{" "}
                        {product.dimensions.height || "0"} cm
                      </p>
                    </div>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1">{new Date(product.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1">{new Date(product.updatedAt).toLocaleString()}</p>
                </div>
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
              This will permanently delete the product &quot;{product.name}&quot;. This action cannot be undone.
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

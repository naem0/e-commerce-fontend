"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Edit, Trash2, Printer, Package, DollarSign, Eye, BarChart3 } from "lucide-react"
import { getProductById, deleteProduct } from "@/services/product.service"
import { useToast } from "@/components/ui/use-toast"
import BarcodeGenerator from "@/components/barcode-generator"
import BarcodePrinter from "@/components/barcode-printer"

export default function ProductDetailPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await getProductById(id)
      if (response.success) {
        setProduct(response.product)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to fetch product details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product) return

    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        const response = await deleteProduct(product._id)
        if (response.success) {
          toast({
            title: "Success",
            description: "Product deleted successfully.",
          })
          router.push("/admin/products")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePrintBarcode = () => {
    if (!product.barcode) {
      toast({
        title: "No Barcode",
        description: "This product doesn't have a barcode to print.",
        variant: "destructive",
      })
      return
    }
    setBarcodeDialogOpen(true)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { label: "Published", className: "bg-green-500" },
      draft: { label: "Draft", className: "bg-yellow-500" },
      archived: { label: "Archived", className: "bg-red-500" },
    }
    const config = statusConfig[status] || statusConfig.draft
    return <Badge className={config.className}>{config.label}</Badge>
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

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => router.push("/admin/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-600">Product Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {product.barcode && (
            <Button variant="outline" onClick={handlePrintBarcode}>
              <Printer className="h-4 w-4 mr-2" />
              Print Barcode
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/admin/products/edit/${product._id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Price</p>
                <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stock</p>
                <p className="text-2xl font-bold">{product.stock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Views</p>
                <p className="text-2xl font-bold">{product.views || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sales</p>
                <p className="text-2xl font-bold">{product.totalSales || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Images */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {product.images.slice(1).map((image, index) => (
                        <div key={index} className="aspect-square relative rounded overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                            alt={`${product.name} ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No images available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="barcode">Barcode</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-lg">{product.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      {getStatusBadge(product.status)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Category</p>
                      <p>{product.category?.name || "Uncategorized"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Brand</p>
                      <p>{product.brand?.name || "No brand"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Description</p>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                  {product.specification && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Specifications</p>
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.specification }} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">SKU</p>
                      <p className="font-mono">{product.sku || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Stock Quantity</p>
                      <p className="text-lg font-semibold">{product.stock}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Weight</p>
                      <p>{product.weight ? `${product.weight} kg` : "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dimensions</p>
                      <p>
                        {product.dimensions?.length && product.dimensions?.width && product.dimensions?.height
                          ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">SEO Title</p>
                    <p>{product.seo?.title || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">SEO Description</p>
                    <p>{product.seo?.description || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Keywords</p>
                    <p>{product.seo?.keywords || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.tags && product.tags.length > 0 ? (
                        product.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No tags</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="barcode" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Barcode Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.barcode ? (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Barcode</p>
                        <p className="text-lg font-mono font-bold mb-4">{product.barcode}</p>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 p-6 text-center bg-gray-50 text-gray-600 rounded-lg">
                        <div className="inline-block border border-gray-400 p-4 bg-white rounded">
                          <div className="text-sm font-bold mb-3">{product.name}</div>
                          <BarcodeGenerator value={product.barcode} width={2} height={60} displayValue={true} />
                          <div className="text-sm font-bold mt-2">${product.price.toFixed(2)}</div>
                        </div>
                      </div>
                      <Button onClick={handlePrintBarcode} className="w-full">
                        <Printer className="h-4 w-4 mr-2" />
                        Print Barcode Labels
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">This product doesn't have a barcode</p>
                      <Button variant="outline" asChild>
                        <Link href={`/admin/products/edit/${product._id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Add Barcode
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Barcode Print Dialog */}
      <Dialog open={barcodeDialogOpen} onOpenChange={setBarcodeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Print Barcode - {product.name}</DialogTitle>
          </DialogHeader>
          <BarcodePrinter product={product} onClose={() => setBarcodeDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

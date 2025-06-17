"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from "@/components/ui/use-toast"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
// import { productService, categoryService } from "@/services/api"
import { getProducts, updateProduct, deleteProduct } from "@/services/product.service"
import { getCategories } from "@/services/category.service"

export default function ProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      }

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === "") {
          delete params[key]
        }
      })

      const response = await getProducts(params)
      setProducts(response.products)
      setPagination({
        ...pagination,
        total: response.total,
        totalPages: response.totalPages,
      })
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories for filter
  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      setCategories(response.categories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [pagination.page, pagination.limit])

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Apply filters
  const applyFilters = () => {
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset to first page when applying filters
    }))
    fetchProducts()
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      category: "",
      status: "",
    })
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }))
    fetchProducts()
  }

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }))
  }

  // Handle status change
  const handleStatusChange = async (productId, newStatus) => {
    try {
      await updateProduct(productId, newStatus)

      // Update product in state
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product._id === productId ? { ...product, status: newStatus } : product)),
      )

      toast({
        title: "Status Updated",
        description: `Product status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating product status:", error)
      toast({
        title: "Error",
        description: "Failed to update product status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle delete
  const confirmDelete = (product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      await deleteProduct(productToDelete._id)

      // Remove product from state
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productToDelete._id))

      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge className="bg-yellow-500">Inactive</Badge>
      case "draft":
        return <Badge className="bg-gray-500">Draft</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <Button onClick={() => router.push("/admin/products/create")}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Manage your products, update status, or remove products.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-[180px]">
                <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-[180px]">
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={applyFilters}>Apply Filters</Button>
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <div className="h-12 w-12 relative rounded overflow-hidden">
                            <Image
                              src={product.images?.[0] || "/placeholder.svg?height=48&width=48"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/products/${product._id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/products/edit/${product._id}`}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Status</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(product._id, "active")}
                                disabled={product.status === "active"}
                              >
                                Set as Active
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(product._id, "inactive")}
                                disabled={product.status === "inactive"}
                              >
                                Set as Inactive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(product._id, "draft")}
                                disabled={product.status === "draft"}
                              >
                                Set as Draft
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => confirmDelete(product)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page === 1}
                    />
                  </PaginationItem>

                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1

                    // Show first page, last page, and pages around current page
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.page - 1 && page <= pagination.page + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink isActive={page === pagination.page} onClick={() => handlePageChange(page)}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }

                    // Show ellipsis for gaps
                    if (page === 2 || page === pagination.totalPages - 1) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }

                    return null
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                      disabled={pagination.page === pagination.totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product &quot;{productToDelete?.name}&quot;. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

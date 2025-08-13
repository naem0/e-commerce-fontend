"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Download,
  Upload,
} from "lucide-react"
import { formatPrice, formatDate } from "@/services/utils"
import { productService } from "@/services/api"

export default function InventoryManagementPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Inventory stats
  const [inventoryStats, setInventoryStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  })

  useEffect(() => {
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    try {
      setLoading(true)

      // Fetch products with inventory data
      const productsResponse = await productService.getProducts({
        limit: 1000,
        status: "published",
        includeInventory: true,
      })

      if (productsResponse.success) {
        const productsData = productsResponse.products
        setProducts(productsData)

        // Calculate inventory stats
        const stats = calculateInventoryStats(productsData)
        setInventoryStats(stats)
      }

      // Fetch categories and suppliers for filters
      const [categoriesRes, suppliersRes] = await Promise.all([fetch("/api/categories"), fetch("/api/suppliers")])

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])
      }

      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json()
        setSuppliers(suppliersData.suppliers || [])
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch inventory data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateInventoryStats = (productsData) => {
    let totalProducts = 0
    let inStock = 0
    let lowStock = 0
    let outOfStock = 0
    let totalValue = 0

    productsData.forEach((product) => {
      totalProducts++

      // Calculate total stock (including variants)
      let productStock = product.stock || 0
      if (product.hasVariations && product.variants) {
        productStock = product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0)
      }

      // Calculate inventory value
      const productPrice = product.price || 0
      totalValue += productStock * productPrice

      // Categorize by stock level
      if (productStock === 0) {
        outOfStock++
      } else if (productStock <= (product.lowStockThreshold || 10)) {
        lowStock++
      } else {
        inStock++
      }
    })

    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalValue,
    }
  }

  const getStockStatus = (product) => {
    let totalStock = product.stock || 0

    if (product.hasVariations && product.variants) {
      totalStock = product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0)
    }

    const lowStockThreshold = product.lowStockThreshold || 10

    if (totalStock === 0) {
      return { status: "Out of Stock", color: "bg-red-100 text-red-800", stock: totalStock }
    } else if (totalStock <= lowStockThreshold) {
      return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800", stock: totalStock }
    } else {
      return { status: "In Stock", color: "bg-green-100 text-green-800", stock: totalStock }
    }
  }

  const getStockProgress = (product) => {
    let totalStock = product.stock || 0
    let maxStock = product.maxStock || 100

    if (product.hasVariations && product.variants) {
      totalStock = product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0)
      maxStock = product.variants.reduce((sum, variant) => sum + (variant.maxStock || 100), 0)
    }

    return Math.min((totalStock / maxStock) * 100, 100)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category?._id === categoryFilter
    const matchesSupplier = supplierFilter === "all" || product.supplier?._id === supplierFilter

    let matchesStatus = true
    if (statusFilter !== "all") {
      const stockInfo = getStockStatus(product)
      matchesStatus = stockInfo.status.toLowerCase().replace(" ", "_") === statusFilter
    }

    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus
  })

  const handleExportInventory = () => {
    // Create CSV data
    const csvData = [
      ["Product Name", "SKU", "Category", "Stock", "Unit Price", "Selling Price", "Status", "Last Updated"],
      ...filteredProducts.map((product) => {
        const stockInfo = getStockStatus(product)
        return [
          product.name,
          product.sku || "",
          product.category?.name || "",
          stockInfo.stock,
          product.price || 0,
          product.salePrice || product.price || 0,
          stockInfo.status,
          formatDate(product.updatedAt),
        ]
      }),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Manage your stock and product information</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportInventory}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => router.push("/admin/products/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{inventoryStats.totalProducts}</p>
                <p className="text-xs text-gray-500">Active inventory items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{inventoryStats.inStock}</p>
                <p className="text-xs text-gray-500">Products available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStock}</p>
                <p className="text-xs text-gray-500">Need restocking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
                <p className="text-xs text-gray-500">Urgent reorder</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">{formatPrice(inventoryStats.totalValue)}</p>
                <p className="text-xs text-gray-500">Inventory worth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by product name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
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

            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockInfo = getStockStatus(product)
                  const stockProgress = getStockProgress(product)

                  return (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sku || "No SKU"}</p>
                          {product.hasVariations && (
                            <p className="text-xs text-blue-600">{product.variants?.length || 0} variants</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{product.category?.name || "Uncategorized"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{product.supplier?.name || "No Supplier"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {stockInfo.stock}/{product.maxStock || 100}
                            </span>
                          </div>
                          <Progress value={stockProgress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={stockInfo.color}>{stockInfo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatPrice(product.price || 0)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatPrice(product.salePrice || product.price || 0)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {product.expiryDate ? formatDate(product.expiryDate) : "No expiry"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product)
                              setShowDetailsModal(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Inventory Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {selectedProduct.name}
                    </p>
                    <p>
                      <strong>SKU:</strong> {selectedProduct.sku || "No SKU"}
                    </p>
                    <p>
                      <strong>Category:</strong> {selectedProduct.category?.name || "Uncategorized"}
                    </p>
                    <p>
                      <strong>Brand:</strong> {selectedProduct.brand?.name || "No Brand"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Unit Price:</strong> {formatPrice(selectedProduct.price || 0)}
                    </p>
                    <p>
                      <strong>Selling Price:</strong>{" "}
                      {formatPrice(selectedProduct.salePrice || selectedProduct.price || 0)}
                    </p>
                    <p>
                      <strong>Compare Price:</strong> {formatPrice(selectedProduct.comparePrice || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stock Information */}
              <div>
                <h3 className="font-semibold mb-2">Stock Information</h3>
                {selectedProduct.hasVariations && selectedProduct.variants ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">This product has variations:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProduct.variants.map((variant, index) => (
                        <div key={index} className="border rounded p-3">
                          <p className="font-medium">{variant.sku}</p>
                          <p className="text-sm">
                            Options: {variant.options?.map((opt) => `${opt.type}: ${opt.value}`).join(", ")}
                          </p>
                          <p className="text-sm">
                            Stock: <span className="font-medium">{variant.stock || 0}</span>
                          </p>
                          <p className="text-sm">Price: {formatPrice(variant.price || 0)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p>
                        <strong>Current Stock:</strong> {selectedProduct.stock || 0}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Low Stock Threshold:</strong> {selectedProduct.lowStockThreshold || 10}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Max Stock:</strong> {selectedProduct.maxStock || 100}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                <div className="text-sm text-gray-600">
                  <p>Last updated: {formatDate(selectedProduct.updatedAt)}</p>
                  <p>Created: {formatDate(selectedProduct.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

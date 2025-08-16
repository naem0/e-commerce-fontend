"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Eye, Edit, Trash2, Package, DollarSign, Calendar, User } from "lucide-react"
import { formatPrice, formatDate } from "@/services/utils"
import { productService } from "@/services/api"
import { getPurchases, createPurchase } from "@/services/purchase.service"
import { getSuppliers } from "@/services/supplier.service"

export default function PurchasesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [purchases, setPurchases] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Purchase form state
  const [purchaseForm, setPurchaseForm] = useState({
    supplier: "",
    invoiceNumber: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    items: [{ product: "", quantity: "", unitCost: "", totalCost: "" }],
    totalAmount: 0,
    paidAmount: 0,
    paymentStatus: "pending",
    paymentMethod: "cash",
    notes: "",
  })

  useEffect(() => {
    fetchPurchases()
    fetchProducts()
    fetchSuppliers()
  }, [])

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const response = await getPurchases()
      if (response.success) {
        setPurchases(response.purchases)
      }
    } catch (error) {
      console.error("Error fetching purchases:", error)
      toast({
        title: "Error",
        description: "Failed to fetch purchases",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts({ limit: 1000, status: "published" })
      if (response.success) {
        setProducts(response.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await getSuppliers()
      if (response.success) {
        setSuppliers(response.data || [])
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error)
    }
  }

  const handleAddItem = () => {
    setPurchaseForm((prev) => ({
      ...prev,
      items: [...prev.items, { product: "", quantity: "", unitCost: "", totalCost: "" }],
    }))
  }

  const handleRemoveItem = (index) => {
    setPurchaseForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
    calculateTotal()
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...purchaseForm.items]
    updatedItems[index][field] = value

    // Calculate total cost for the item
    if (field === "quantity" || field === "unitCost") {
      const quantity = Number.parseFloat(updatedItems[index].quantity) || 0
      const unitCost = Number.parseFloat(updatedItems[index].unitCost) || 0
      updatedItems[index].totalCost = (quantity * unitCost).toFixed(2)
    }

    setPurchaseForm((prev) => ({
      ...prev,
      items: updatedItems,
    }))

    calculateTotal()
  }

  const calculateTotal = () => {
    const total = purchaseForm.items.reduce((sum, item) => {
      return sum + (Number.parseFloat(item.totalCost) || 0)
    }, 0)

    setPurchaseForm((prev) => ({
      ...prev,
      totalAmount: total,
    }))
  }

  const handleSubmitPurchase = async (e) => {
    e.preventDefault()
    try {
      // Validate form
      if (!purchaseForm.supplier || !purchaseForm.invoiceNumber) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const response = await createPurchase(purchaseForm)

      if (response.success) {
        toast({
          title: "Success",
          description: "Purchase created successfully",
        })

        setShowAddModal(false)
        setPurchaseForm({
          supplier: "",
          invoiceNumber: "",
          purchaseDate: new Date().toISOString().split("T")[0],
          items: [{ product: "", quantity: "", unitCost: "", totalCost: "" }],
          totalAmount: 0,
          paidAmount: 0,
          paymentStatus: "pending",
          paymentMethod: "cash",
          notes: "",
        })

        fetchPurchases()
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Error creating purchase:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create purchase",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || purchase.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Purchase Management</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Purchase
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                <p className="text-2xl font-bold">{purchases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">
                  {formatPrice(purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">
                  {purchases.filter((p) => new Date(p.createdAt).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
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
                  placeholder="Search by invoice number or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase._id}>
                    <TableCell className="font-medium">{purchase.invoiceNumber}</TableCell>
                    <TableCell>{purchase.supplier?.name || "Unknown"}</TableCell>
                    <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                    <TableCell>{purchase.items?.length || 0} items</TableCell>
                    <TableCell className="font-medium">{formatPrice(purchase.totalAmount || 0)}</TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(purchase.paymentStatus)}>{purchase.paymentStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(purchase.status)}>{purchase.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPurchase(purchase)
                            setShowDetailsModal(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Purchase Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Purchase</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitPurchase} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier">Supplier *</Label>
                <Select
                  value={purchaseForm.supplier}
                  onValueChange={(value) => setPurchaseForm((prev) => ({ ...prev, supplier: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                <Input
                  id="invoiceNumber"
                  value={purchaseForm.invoiceNumber}
                  onChange={(e) => setPurchaseForm((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                  placeholder="Enter invoice number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseForm.purchaseDate}
                  onChange={(e) => setPurchaseForm((prev) => ({ ...prev, purchaseDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={purchaseForm.paymentMethod}
                  onValueChange={(value) => setPurchaseForm((prev) => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Purchase Items</Label>
                <Button type="button" onClick={handleAddItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {purchaseForm.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Product</Label>
                      <Select value={item.product} onValueChange={(value) => handleItemChange(index, "product", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product._id} value={product._id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Unit Cost</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitCost}
                        onChange={(e) => handleItemChange(index, "unitCost", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Total Cost</Label>
                      <Input type="number" step="0.01" value={item.totalCost} readOnly className="bg-gray-50" />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        disabled={purchaseForm.items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  value={purchaseForm.totalAmount}
                  readOnly
                  className="bg-gray-50 font-bold"
                />
              </div>
              <div>
                <Label htmlFor="paidAmount">Paid Amount</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  step="0.01"
                  value={purchaseForm.paidAmount}
                  onChange={(e) =>
                    setPurchaseForm((prev) => ({ ...prev, paidAmount: Number.parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={purchaseForm.paymentStatus}
                  onValueChange={(value) => setPurchaseForm((prev) => ({ ...prev, paymentStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Purchase</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Purchase Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Purchase Details</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Number</Label>
                  <p className="font-medium">{selectedPurchase.invoiceNumber}</p>
                </div>
                <div>
                  <Label>Supplier</Label>
                  <p className="font-medium">{selectedPurchase.supplier?.name || "Unknown"}</p>
                </div>
                <div>
                  <Label>Purchase Date</Label>
                  <p className="font-medium">{formatDate(selectedPurchase.purchaseDate)}</p>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <p className="font-medium capitalize">{selectedPurchase.paymentMethod?.replace("_", " ")}</p>
                </div>
              </div>

              <div>
                <Label>Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedPurchase.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{item.product?.name || "Unknown Product"}</span>
                      <span>
                        {item.quantity} × {formatPrice(item.unitCost || 0)} = {formatPrice(item.totalCost || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>{formatPrice(selectedPurchase.totalAmount || 0)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

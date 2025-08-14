"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Mail, Phone, MapPin, Building2, User, Calendar, Package, DollarSign } from "lucide-react"
import Link from "next/link"
import { getSupplierById, getSupplierStatusById } from "@/services/supplier.service"
import { purchaseService } from "@/services/purchase.service"

export default function SupplierDetailsPage() {
  
  const params = useParams()
  const router = useRouter()
  const [supplier, setSupplier] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalAmount: 0,
    pendingAmount: 0,
    lastPurchase: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchSupplier()
    }
  }, [params.id])

  const fetchSupplier = async () => {
    try {
      const response = await getSupplierById(params.id)
      setSupplier(response.data)
    } catch (error) {
      console.error("Error fetching supplier:", error)
      router.push("/admin/suppliers")
    }

    fetchPurchases()
    fetchStats()
  }

  const fetchPurchases = async () => {
    try {
      const response = await purchaseService.getAll({ supplier: params.id, limit: 10 })
      setPurchases(response.data || [])
    } catch (error) {
      console.error("Error fetching purchases:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await getSupplierStatusById(params.id)
      setStats(
        response.data || {
          totalPurchases: 0,
          totalAmount: 0,
          pendingAmount: 0,
          lastPurchase: null,
        },
      )
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Supplier not found</h2>
          <p className="text-gray-600 mt-2">The supplier you're looking for doesn't exist.</p>
          <Link href="/admin/suppliers">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Suppliers
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <Link href="/admin/suppliers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Suppliers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{supplier.name}</h1>
            <p className="text-muted-foreground">Supplier ID: {supplier._id.slice(-8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={supplier.status === "active" ? "default" : "secondary"}
            className={supplier.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            {supplier.status}
          </Badge>
          <Link href={`/admin/suppliers/edit/${supplier._id}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Supplier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{supplier.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Payment Terms:</span>
                    <Badge variant="outline">
                      {supplier.paymentTerms?.replace("_", " ").toUpperCase() || "NET 30"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  {supplier.taxId && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Tax ID:</span>
                      <span className="text-sm">{supplier.taxId}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Created:</span>
                    <span className="text-sm">{new Date(supplier.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {supplier.address && (supplier.address.street || supplier.address.city) ? (
                <div className="space-y-2">
                  {supplier.address.street && <p className="text-sm">{supplier.address.street}</p>}
                  <p className="text-sm">
                    {[supplier.address.city, supplier.address.state, supplier.address.zipCode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {supplier.address.country && <p className="text-sm font-medium">{supplier.address.country}</p>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No address information provided</p>
              )}
            </CardContent>
          </Card>

          {/* Contact Person */}
          {supplier.contactPerson &&
            (supplier.contactPerson.name || supplier.contactPerson.email || supplier.contactPerson.phone) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Contact Person
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supplier.contactPerson.name && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm">{supplier.contactPerson.name}</span>
                    </div>
                  )}
                  {supplier.contactPerson.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm">{supplier.contactPerson.email}</span>
                    </div>
                  )}
                  {supplier.contactPerson.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Phone:</span>
                      <span className="text-sm">{supplier.contactPerson.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          {/* Notes */}
          {supplier.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{supplier.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Recent Purchases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Recent Purchases
              </CardTitle>
              <CardDescription>Latest purchase orders from this supplier</CardDescription>
            </CardHeader>
            <CardContent>
              {purchases.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Purchase ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((purchase) => (
                        <TableRow key={purchase._id}>
                          <TableCell className="font-medium">#{purchase._id.slice(-6)}</TableCell>
                          <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{purchase.items?.length || 0} items</TableCell>
                          <TableCell>${purchase.totalAmount?.toFixed(2) || "0.00"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{purchase.status || "pending"}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No purchases found for this supplier</p>
              )}
            </CardContent>
          </Card>
        </div>

        
      </div>
    </div>
  )
}

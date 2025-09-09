"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { getSupplierById, updateSupplier } from "@/services/supplier.service"
import toast from "react-hot-toast"

export default function EditSupplierPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    contactPerson: {
      name: "",
      phone: "",
      email: "",
    },
    taxId: "",
    paymentTerms: "net_30",
    status: "active",
    notes: "",
  })

  useEffect(() => {
    if (params.id) {
      fetchSupplier()
    }
  }, [params.id])

  const fetchSupplier = async () => {
    try {
      const response = await getSupplierById(params.id)
      const supplier = response.data
      setFormData({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: {
          street: supplier.address?.street || "",
          city: supplier.address?.city || "",
          state: supplier.address?.state || "",
          zipCode: supplier.address?.zipCode || "",
          country: supplier.address?.country || "",
        },
        contactPerson: {
          name: supplier.contactPerson?.name || "",
          phone: supplier.contactPerson?.phone || "",
          email: supplier.contactPerson?.email || "",
        },
        taxId: supplier.taxId || "",
        paymentTerms: supplier.paymentTerms || "net_30",
        status: supplier.status || "active",
        notes: supplier.notes || "",
      })
    } catch (error) {
      console.error("Error fetching supplier:", error)
      router.push("/admin/suppliers")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await updateSupplier(params.id, formData)
      if (response.success) {
        router.push(`/admin/suppliers/${params.id}`)
      } else {
        toast.error("Error updating supplier. Please try again.")
      }
    } catch (error) {
      console.error("Error updating supplier:", error)
      toast.error("Error updating supplier. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/suppliers/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Supplier
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Supplier</h1>
          <p className="text-muted-foreground">Update supplier information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update the basic details of the supplier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter supplier name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="supplier@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="Enter tax identification number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select
                  value={formData.paymentTerms}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentTerms: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net_30">Net 30 Days</SelectItem>
                    <SelectItem value="net_60">Net 60 Days</SelectItem>
                    <SelectItem value="net_90">Net 90 Days</SelectItem>
                    <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                    <SelectItem value="advance_payment">Advance Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
            <CardDescription>Update the supplier's address details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address.street">Street Address</Label>
              <Input
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address.city">City</Label>
                <Input
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.state">State/Province</Label>
                <Input
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  placeholder="Enter state or province"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address.zipCode">ZIP/Postal Code</Label>
                <Input
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  placeholder="Enter ZIP or postal code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.country">Country</Label>
                <Input
                  id="address.country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Person */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Person</CardTitle>
            <CardDescription>Primary contact person at the supplier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson.name">Contact Name</Label>
                <Input
                  id="contactPerson.name"
                  name="contactPerson.name"
                  value={formData.contactPerson.name}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson.phone">Contact Phone</Label>
                <Input
                  id="contactPerson.phone"
                  name="contactPerson.phone"
                  value={formData.contactPerson.phone}
                  onChange={handleInputChange}
                  placeholder="Enter contact phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson.email">Contact Email</Label>
                <Input
                  id="contactPerson.email"
                  name="contactPerson.email"
                  type="email"
                  value={formData.contactPerson.email}
                  onChange={handleInputChange}
                  placeholder="contact@supplier.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Any additional information about the supplier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter any additional notes about the supplier..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href={`/admin/suppliers/${params.id}`}>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Update Supplier
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

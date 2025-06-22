"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, User, MapPin, Package, Settings, Plus, Edit, Trash2, Eye, Download } from "lucide-react"
import { formatPrice, formatDate } from "@/services/utils"
import { getUserProfile, updateUserProfile } from "@/services/user.service"
import { getUserOrders } from "@/services/order.service"

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  })

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    isDefault: false,
  })

  useEffect(() => {
    if (!session) {
      router.push("/auth/login")
      return
    }

    fetchUserData()
  }, [session])

  const fetchUserData = async () => {
    try {
      setLoading(true)

      // Fetch user profile
      const profileResponse = await getUserProfile()
      if (profileResponse.success) {
        setUser(profileResponse.user)
        setProfileForm({
          name: profileResponse.user.name || "",
          email: profileResponse.user.email || "",
          phone: profileResponse.user.phone || "",
          dateOfBirth: profileResponse.user.dateOfBirth || "",
          gender: profileResponse.user.gender || "",
        })
      }

      // Fetch user orders
      const ordersResponse = await getUserOrders()
      if (ordersResponse.success) {
        setOrders(ordersResponse.orders || [])
      }
    } catch (error) {
      console.error("Fetch user data error:", error)
      toast({
        title: t("profile.error") || "Error",
        description: error.message || "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      setUpdating(true)

      const response = await updateUserProfile(profileForm)

      if (response.success) {
        setUser(response.user)
        toast({
          title: t("profile.success") || "Success",
          description: t("profile.updated") || "Profile updated successfully",
        })
      } else {
        throw new Error(response.message || "Update failed")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: t("profile.error") || "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    try {
      setUpdating(true)

      const addresses = user.addresses || []

      if (editingAddress !== null) {
        // Update existing address
        addresses[editingAddress] = addressForm
      } else {
        // Add new address
        addresses.push(addressForm)
      }

      const response = await updateUserProfile({ addresses })

      if (response.success) {
        setUser(response.user)
        setAddressModalOpen(false)
        setEditingAddress(null)
        setAddressForm({
          name: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "Bangladesh",
          isDefault: false,
        })
        toast({
          title: t("profile.success") || "Success",
          description: t("profile.addressUpdated") || "Address updated successfully",
        })
      } else {
        throw new Error(response.message || "Address update failed")
      }
    } catch (error) {
      console.error("Address update error:", error)
      toast({
        title: t("profile.error") || "Error",
        description: error.message || "Failed to update address",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteAddress = async (index) => {
    try {
      const addresses = user.addresses.filter((_, i) => i !== index)
      const response = await updateUserProfile({ addresses })

      if (response.success) {
        setUser(response.user)
        toast({
          title: t("profile.success") || "Success",
          description: t("profile.addressDeleted") || "Address deleted successfully",
        })
      }
    } catch (error) {
      console.error("Delete address error:", error)
      toast({
        title: t("profile.error") || "Error",
        description: error.message || "Failed to delete address",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("profile.title") || "My Profile"}</h1>
        <p className="text-gray-600 mt-2">{t("profile.subtitle") || "Manage your account settings and preferences"}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("profile.personalInfo") || "Personal Info"}
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t("profile.addresses") || "Addresses"}
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            {t("profile.orders") || "Orders"}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t("profile.settings") || "Settings"}
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.personalInfo") || "Personal Information"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t("profile.name") || "Full Name"}</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t("profile.email") || "Email"}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t("profile.phone") || "Phone"}</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">{t("profile.dateOfBirth") || "Date of Birth"}</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">{t("profile.gender") || "Gender"}</Label>
                    <select
                      id="gender"
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t("profile.selectGender") || "Select Gender"}</option>
                      <option value="male">{t("profile.male") || "Male"}</option>
                      <option value="female">{t("profile.female") || "Female"}</option>
                      <option value="other">{t("profile.other") || "Other"}</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" disabled={updating}>
                  {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("profile.updateProfile") || "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("profile.addresses") || "Saved Addresses"}</CardTitle>
              <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingAddress(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("profile.addAddress") || "Add Address"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAddress !== null
                        ? t("profile.editAddress") || "Edit Address"
                        : t("profile.addAddress") || "Add Address"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="addressName">{t("profile.name") || "Name"}</Label>
                      <Input
                        id="addressName"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="addressPhone">{t("profile.phone") || "Phone"}</Label>
                      <Input
                        id="addressPhone"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="street">{t("profile.street") || "Street Address"}</Label>
                      <Textarea
                        id="street"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">{t("profile.city") || "City"}</Label>
                        <Input
                          id="city"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">{t("profile.zipCode") || "ZIP Code"}</Label>
                        <Input
                          id="zipCode"
                          value={addressForm.zipCode}
                          onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="state">{t("profile.state") || "State/Division"}</Label>
                      <Input
                        id="state"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="isDefault">{t("profile.defaultAddress") || "Set as default address"}</Label>
                    </div>
                    <Button type="submit" disabled={updating} className="w-full">
                      {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingAddress !== null
                        ? t("profile.updateAddress") || "Update Address"
                        : t("profile.addAddress") || "Add Address"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {user?.addresses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((address, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{address.name}</h3>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingAddress(index)
                              setAddressForm(address)
                              setAddressModalOpen(true)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteAddress(index)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                      <p className="text-sm text-gray-600">{address.street}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}
                        {address.state && `, ${address.state}`}
                        {address.zipCode && ` ${address.zipCode}`}
                      </p>
                      <p className="text-sm text-gray-600">{address.country}</p>
                      {address.isDefault && (
                        <Badge className="mt-2 bg-primary/10 text-primary">{t("profile.default") || "Default"}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">{t("profile.noAddresses") || "No addresses saved"}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.orderHistory") || "Order History"}</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">
                            {t("profile.orderNumber") || "Order"} #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)} • {order.items.length} {t("profile.items") || "items"}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <p className="font-medium mt-1">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/orders/${order._id}`)}>
                          <Eye className="mr-1 h-3 w-3" />
                          {t("profile.viewDetails") || "View Details"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => router.push(`/orders/${order._id}/invoice`)}>
                          <Download className="mr-1 h-3 w-3" />
                          {t("profile.invoice") || "Invoice"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">{t("profile.noOrders") || "No orders found"}</p>
                  <Button className="mt-4" onClick={() => router.push("/products")}>
                    {t("profile.startShopping") || "Start Shopping"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.accountSettings") || "Account Settings"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{t("profile.changePassword") || "Change Password"}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t("profile.passwordNote") || "Update your password to keep your account secure"}
                  </p>
                  <Button variant="outline">{t("profile.updatePassword") || "Update Password"}</Button>
                </div>

                <hr />

                <div>
                  <h3 className="text-lg font-medium mb-2">{t("profile.notifications") || "Notifications"}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{t("profile.emailNotifications") || "Email notifications"}</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t("profile.orderUpdates") || "Order updates"}</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t("profile.promotions") || "Promotional emails"}</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>

                <hr />

                <div>
                  <h3 className="text-lg font-medium mb-2 text-red-600">{t("profile.dangerZone") || "Danger Zone"}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t("profile.deleteAccountNote") || "Once you delete your account, there is no going back."}
                  </p>
                  <Button variant="destructive">{t("profile.deleteAccount") || "Delete Account"}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

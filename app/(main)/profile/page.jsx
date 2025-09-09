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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Loader2,
  User,
  MapPin,
  Package,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Camera,
  Mail,
  Phone,
  Calendar,
  Shield,
  Bell,
  CreditCard,
  Heart,
  Star,
} from "lucide-react"
import { formatPrice, formatDate } from "@/services/utils"
import { getProfile, updateProfile } from "@/services/user.service"
import { getOrders } from "@/services/order.service"
import Image from "next/image"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")

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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const fetchUserData = async () => {
    try {
      setLoading(true)
      // Fetch user profile
      const profileResponse = await getProfile()
      console.log("Profile Response:", profileResponse)
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
      const ordersResponse = await getOrders()
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
  useEffect(() => {
    fetchUserData()
  }, [status])
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      setUpdating(true)

      const response = await updateProfile(profileForm)

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

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: t("profile.error") || "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      setUpdating(true)

      const response = await updateProfile({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      if (response.success) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        toast({
          title: t("profile.success") || "Success",
          description: "Password updated successfully",
        })
      } else {
        throw new Error(response.message || "Password update failed")
      }
    } catch (error) {
      console.error("Password update error:", error)
      toast({
        title: t("profile.error") || "Error",
        description: error.message || "Failed to update password",
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

      const response = await updateProfile({ addresses })

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
      const response = await updateProfile({ addresses })

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
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-custom mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="text-2xl font-bold bg-primary-custom text-primary-foreground">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                variant="outline"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {user?.role || "Customer"}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Member since {formatDate(user?.createdAt)}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-primary-custom mx-auto mb-2" />
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {formatPrice(orders.reduce((sum, order) => sum + (order.total || 0), 0))}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-600">Wishlist Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-600">Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-primary-custom data-[state=active]:text-primary-foreground"
            >
              <User className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="flex items-center gap-2 data-[state=active]:bg-primary-custom data-[state=active]:text-primary-foreground"
            >
              <MapPin className="h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 data-[state=active]:bg-primary-custom data-[state=active]:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 data-[state=active]:bg-primary-custom data-[state=active]:text-primary-foreground"
            >
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        required
                        disabled
                        className="h-11 bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="h-11"
                        placeholder="+880 1234 567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profileForm.dateOfBirth}
                        onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                        className="w-full h-11 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <Separator />
                  <Button type="submit" disabled={updating} className="w-full md:w-auto">
                    {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Saved Addresses
                </CardTitle>
                <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingAddress(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingAddress !== null ? "Edit Address" : "Add New Address"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="addressName">Name</Label>
                          <Input
                            id="addressName"
                            value={addressForm.name}
                            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="addressPhone">Phone</Label>
                          <Input
                            id="addressPhone"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Textarea
                          id="street"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          required
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={addressForm.zipCode}
                            onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="state">State/Division</Label>
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
                        <Label htmlFor="isDefault">Set as default address</Label>
                      </div>
                      <Button type="submit" disabled={updating} className="w-full">
                        {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingAddress !== null ? "Update Address" : "Add Address"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {user?.addresses?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{address.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {address.phone}
                            </p>
                          </div>
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
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-start gap-2">
                            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            {address.street}
                          </p>
                          <p className="ml-5">
                            {address.city}
                            {address.state && `, ${address.state}`}
                            {address.zipCode && ` ${address.zipCode}`}
                          </p>
                          <p className="ml-5">{address.country}</p>
                        </div>
                        {address.isDefault && <Badge className="mt-3 bg-primary-custom/10 text-primary-custom">Default</Badge>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No addresses saved</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Add your first address to make checkout faster
                    </p>
                    <Button onClick={() => setAddressModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order._id.slice(-8).toUpperCase()}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(order.createdAt)} • {order.items?.length || 0} items
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <p className="font-bold text-lg mt-1">{formatPrice(order.total)}</p>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        {order.items && order.items.length > 0 && (
                          <div className="mb-4">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div
                                  key={index}
                                  className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                                >
                                  {item.product?.images?.[0] ? (
                                    <Image
                                      src={item.product.images[0] ? process.env.NEXT_PUBLIC_API_URL + item.product.images[0] : "/placeholder.svg"}
                                      alt={item.product.name}
                                      className="rounded-lg"
                                      width={64}
                                      height={64}
                                    />
                                  ) : (
                                    <Package className="h-6 w-6 text-gray-400" />
                                  )}
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => router.push(`/orders/${order._id}`)}>
                            <Eye className="mr-1 h-3 w-3" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/orders/${order._id}/invoice`)}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Download Invoice
                          </Button>
                          {order.status === "delivered" && (
                            <Button size="sm" variant="outline">
                              <Star className="mr-1 h-3 w-3" />
                              Write Review
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Start shopping to see your orders here</p>
                    <Button onClick={() => router.push("/products")}>Start Shopping</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <Button type="submit" disabled={updating}>
                      {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email notifications</p>
                          <p className="text-sm text-gray-600">Receive order updates via email</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS notifications</p>
                          <p className="text-sm text-gray-600">Receive order updates via SMS</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Promotional emails</p>
                          <p className="text-sm text-gray-600">Receive offers and promotions</p>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-red-600 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Danger Zone
                    </h3>
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                      <p className="text-sm text-red-800 dark:text-red-400 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

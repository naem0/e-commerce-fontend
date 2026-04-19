"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Mail, Phone, Calendar, Shield, MapPin, Package, Clock } from 'lucide-react'
import { getUserById } from "@/services/user.service"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

export default function UserDetailsPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await getUserById(params.id)
        if (response.success) {
          setUser(response.user)
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch user details",
            variant: "destructive",
          })
          router.push("/admin/users")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error",
          description: "An error occurred while fetching user details.",
          variant: "destructive",
        })
        router.push("/admin/users")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <div className="mt-4 flex justify-center gap-2">
              <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                {user.role.toUpperCase()}
              </Badge>
              <Badge variant={user.status === 'active' ? 'success' : 'outline'}>
                {user.status || 'Active'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone || "No phone provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {format(new Date(user.createdAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details and History */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">User ID</p>
                <p className="font-mono text-sm">{user._id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Email Verification</p>
                <div className="flex items-center gap-2">
                  <Badge variant={user.emailVerified ? 'success' : 'outline'}>
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Last Update</p>
                <p className="text-sm">{format(new Date(user.updatedAt), "PPP")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Login Provider</p>
                <Badge variant="outline">{user.provider || "Credentials"}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address Book ({user.addresses?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.addresses && user.addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((address, idx) => (
                    <div key={idx} className="p-3 border rounded-lg space-y-1">
                      <div className="flex justify-between">
                        <p className="font-semibold text-sm">{address.name}</p>
                        {address.isDefault && <Badge variant="outline" className="text-[10px] h-4">Default</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{address.phone}</p>
                      <p className="text-xs">{address.street}, {address.city}</p>
                      <p className="text-xs text-muted-foreground">{address.shippingArea?.replace('_', ' ')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No addresses saved</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

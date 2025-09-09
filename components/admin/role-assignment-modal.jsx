"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { User, Shield, Check } from "lucide-react"
import { getAllRoles, PERMISSIONS } from "@/lib/permissions"
import { assignUserRole, getUserRoles, updateUserPermissions } from "@/services/user.service"

export function RoleAssignmentModal({ open, onOpenChange, user, onRoleAssigned }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [customPermissions, setCustomPermissions] = useState([])
  const [userCurrentRoles, setUserCurrentRoles] = useState([])
  const [assignmentMode, setAssignmentMode] = useState("role") // "role" or "custom"

  const roles = getAllRoles()

  useEffect(() => {
    if (user && open) {
      fetchUserRoles()
      setSelectedRole(user.role || "")
      setCustomPermissions(user.permissions || [])
    }
  }, [user, open])

  const fetchUserRoles = async () => {
    try {
      const response = await getUserRoles(user._id)
      setUserCurrentRoles(response.roles || [])
    } catch (error) {
      console.error("Error fetching user roles:", error)
    }
  }

  const handleRoleAssignment = async () => {
    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await assignUserRole(user._id, selectedRole)

      toast({
        title: "Success",
        description: `Role ${selectedRole} assigned to ${user.name}`,
      })

      onRoleAssigned?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error assigning role:", error)
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCustomPermissions = async () => {
    try {
      setLoading(true)
      await updateUserPermissions(user._id, customPermissions)

      toast({
        title: "Success",
        description: `Custom permissions updated for ${user.name}`,
      })

      onRoleAssigned?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating permissions:", error)
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (permission) => {
    setCustomPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    )
  }

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "super_admin":
        return "bg-purple-500"
      case "admin":
        return "bg-red-500"
      case "manager":
        return "bg-blue-500"
      case "employee":
        return "bg-green-500"
      case "cashier":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const groupedPermissions = {
    "Dashboard & Analytics": [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.EXPORT_DATA,
    ],
    "Product Management": [
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.CREATE_PRODUCTS,
      PERMISSIONS.EDIT_PRODUCTS,
      PERMISSIONS.DELETE_PRODUCTS,
      PERMISSIONS.MANAGE_PRODUCT_CATEGORIES,
      PERMISSIONS.MANAGE_PRODUCT_BRANDS,
    ],
    "Order Management": [
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.CREATE_ORDERS,
      PERMISSIONS.EDIT_ORDERS,
      PERMISSIONS.DELETE_ORDERS,
      PERMISSIONS.PROCESS_ORDERS,
    ],
    "User Management": [
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.CREATE_USERS,
      PERMISSIONS.EDIT_USERS,
      PERMISSIONS.DELETE_USERS,
      PERMISSIONS.MANAGE_USER_ROLES,
    ],
    "Inventory & Suppliers": [
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.MANAGE_INVENTORY,
      PERMISSIONS.VIEW_SUPPLIERS,
      PERMISSIONS.MANAGE_SUPPLIERS,
    ],
    "POS & Sales": [PERMISSIONS.ACCESS_POS, PERMISSIONS.PROCESS_SALES, PERMISSIONS.MANAGE_CASH_REGISTER],
    "Content & Settings": [
      PERMISSIONS.MANAGE_SITE_SETTINGS,
      PERMISSIONS.MANAGE_BANNERS,
      PERMISSIONS.MANAGE_HOME_SETTINGS,
      PERMISSIONS.VIEW_REVIEWS,
      PERMISSIONS.MODERATE_REVIEWS,
    ],
    "System Administration": [PERMISSIONS.MANAGE_ROLES, PERMISSIONS.MANAGE_PERMISSIONS, PERMISSIONS.VIEW_SYSTEM_LOGS],
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Assign Role to {user.name}
          </DialogTitle>
          <DialogDescription>
            Assign a role or custom permissions to this user. Roles come with predefined permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Current Role:</span>
                  <Badge className={getRoleBadgeColor(user.role)}>{user.role || "No Role"}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Status: {user.status || "Active"}</div>
              </CardContent>
            </Card>

            {/* Assignment Mode Toggle */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Assignment Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="role-mode"
                      checked={assignmentMode === "role"}
                      onCheckedChange={() => setAssignmentMode("role")}
                    />
                    <Label htmlFor="role-mode" className="text-sm">
                      Assign Role
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="custom-mode"
                      checked={assignmentMode === "custom"}
                      onCheckedChange={() => setAssignmentMode("custom")}
                    />
                    <Label htmlFor="custom-mode" className="text-sm">
                      Custom Permissions
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role Assignment or Custom Permissions */}
          <div className="lg:col-span-2">
            {assignmentMode === "role" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Select Role</CardTitle>
                  <CardDescription>Choose a predefined role with specific permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.key} value={role.key}>
                            <div className="flex items-center gap-2">
                              <Badge className={getRoleBadgeColor(role.key)}>{role.name}</Badge>
                              <span className="text-sm text-muted-foreground">
                                ({role.permissions.length} permissions)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedRole && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Role Permissions:</h4>
                        <ScrollArea className="h-32 border rounded p-2">
                          <div className="space-y-1">
                            {roles
                              .find((r) => r.key === selectedRole)
                              ?.permissions.map((permission) => (
                                <div key={permission} className="flex items-center gap-2 text-xs">
                                  <Check className="h-3 w-3 text-green-500" />
                                  <span>{permission.replace(/_/g, " ").toLowerCase()}</span>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Custom Permissions</CardTitle>
                  <CardDescription>Select specific permissions for this user</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {Object.entries(groupedPermissions).map(([group, permissions]) => (
                        <div key={group}>
                          <h4 className="font-medium text-sm mb-2">{group}</h4>
                          <div className="space-y-2 ml-4">
                            {permissions.map((permission) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <Checkbox
                                  id={permission}
                                  checked={customPermissions.includes(permission)}
                                  onCheckedChange={() => togglePermission(permission)}
                                />
                                <Label htmlFor={permission} className="text-xs">
                                  {permission.replace(/_/g, " ").toLowerCase()}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <Separator className="mt-3" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={assignmentMode === "role" ? handleRoleAssignment : handleCustomPermissions}
            disabled={loading || (assignmentMode === "role" && !selectedRole)}
          >
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Search, MoreHorizontal, Edit, Eye, Plus, Shield, Users } from "lucide-react"
import { PERMISSIONS, getAllRoles } from "@/lib/permissions"
import { usePermissions } from "@/hooks/use-permissions"
import { PermissionGuard } from "@/components/permission-guard"

export default function RolesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { hasPermission } = usePermissions()
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  })

  const fetchRoles = async () => {
    try {
      setLoading(true)
      // For now, use static roles data
      const rolesData = getAllRoles()
      setRoles(rolesData)
    } catch (error) {
      console.error("Error fetching roles:", error)
      toast({
        title: "Error",
        description: "Failed to fetch roles. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleCreateRole = () => {
    setEditingRole(null)
    setFormData({
      name: "",
      description: "",
      permissions: [],
    })
    setDialogOpen(true)
  }

  const handleEditRole = (role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || [],
    })
    setDialogOpen(true)
  }

  const handleSaveRole = async () => {
    try {
      if (!formData.name.trim()) {
        toast({
          title: "Error",
          description: "Role name is required.",
          variant: "destructive",
        })
        return
      }

      // Here you would typically save to backend
      console.log("Saving role:", formData)

      toast({
        title: "Success",
        description: `Role ${editingRole ? "updated" : "created"} successfully.`,
      })

      setDialogOpen(false)
      fetchRoles()
    } catch (error) {
      console.error("Error saving role:", error)
      toast({
        title: "Error",
        description: "Failed to save role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePermissionChange = (permission, checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked ? [...prev.permissions, permission] : prev.permissions.filter((p) => p !== permission),
    }))
  }

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const groupedPermissions = {
    Dashboard: [PERMISSIONS.VIEW_DASHBOARD],
    Products: [
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.CREATE_PRODUCTS,
      PERMISSIONS.EDIT_PRODUCTS,
      PERMISSIONS.DELETE_PRODUCTS,
      PERMISSIONS.MANAGE_PRODUCT_CATEGORIES,
      PERMISSIONS.MANAGE_PRODUCT_BRANDS,
    ],
    Orders: [
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.CREATE_ORDERS,
      PERMISSIONS.EDIT_ORDERS,
      PERMISSIONS.DELETE_ORDERS,
      PERMISSIONS.PROCESS_ORDERS,
    ],
    Users: [
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.CREATE_USERS,
      PERMISSIONS.EDIT_USERS,
      PERMISSIONS.DELETE_USERS,
      PERMISSIONS.MANAGE_USER_ROLES,
    ],
    Inventory: [
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.MANAGE_INVENTORY,
      PERMISSIONS.VIEW_SUPPLIERS,
      PERMISSIONS.MANAGE_SUPPLIERS,
    ],
    POS: [PERMISSIONS.ACCESS_POS, PERMISSIONS.PROCESS_SALES, PERMISSIONS.MANAGE_CASH_REGISTER],
    Reports: [PERMISSIONS.VIEW_REPORTS, PERMISSIONS.VIEW_ANALYTICS, PERMISSIONS.EXPORT_DATA],
    Settings: [PERMISSIONS.MANAGE_SITE_SETTINGS, PERMISSIONS.MANAGE_BANNERS, PERMISSIONS.MANAGE_HOME_SETTINGS],
    System: [PERMISSIONS.MANAGE_ROLES, PERMISSIONS.MANAGE_PERMISSIONS, PERMISSIONS.VIEW_SYSTEM_LOGS],
  }

  useEffect(() => {
    if (hasPermission(PERMISSIONS.MANAGE_ROLES)) {
      fetchRoles()
    }
  }, [])

  return (
    <div className="flex-1 space-y-4">
      {hasPermission(PERMISSIONS.MANAGE_ROLES) ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
            <PermissionGuard permission={PERMISSIONS.MANAGE_ROLES}>
              <Button onClick={handleCreateRole}>
                <Plus className="mr-2 h-4 w-4" /> Create Role
              </Button>
            </PermissionGuard>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Manage user roles and their permissions across the system.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Roles Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredRoles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          No roles found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRoles.map((role) => (
                        <TableRow key={role.key}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Shield className="mr-2 h-4 w-4 text-blue-500" />
                              {role.name}
                            </div>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{role.permissions.length} permissions</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-500">0 users</span>
                            </div>
                          </TableCell>
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
                                <DropdownMenuItem onClick={() => handleEditRole(role)}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <PermissionGuard permission={PERMISSIONS.MANAGE_ROLES}>
                                  <DropdownMenuItem onClick={() => handleEditRole(role)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Role
                                  </DropdownMenuItem>
                                </PermissionGuard>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Create/Edit Role Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
                <DialogDescription>
                  {editingRole
                    ? "Update role details and permissions."
                    : "Create a new role with specific permissions."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Role Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                    placeholder="Enter role name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="col-span-3"
                    placeholder="Enter role description"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Permissions</Label>
                  <div className="col-span-3 space-y-4">
                    {Object.entries(groupedPermissions).map(([group, permissions]) => (
                      <div key={group} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">{group}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {permissions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission}
                                checked={formData.permissions.includes(permission)}
                                onCheckedChange={(checked) => handlePermissionChange(permission, checked)}
                              />
                              <Label htmlFor={permission} className="text-sm">
                                {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveRole}>{editingRole ? "Update Role" : "Create Role"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
            <p className="mt-1 text-sm text-gray-500">You don't have permission to manage roles.</p>
          </div>
        </div>
      )}
    </div>
  )
}

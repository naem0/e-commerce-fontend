"use client"

import { useState, useEffect } from "react"
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
import { Search, MoreHorizontal, Edit, Trash2, Eye, Shield, Users, Plus } from "lucide-react"
import { getAllRoles, PERMISSIONS } from "@/lib/permissions"
import { PermissionGuard } from "@/components/permission-guard"
import { PageGuard } from "@/components/page-guard"
import { getUsersByRole } from "@/services/user.service"

function RolesPageContent() {
  const { toast } = useToast()
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState(null)
  const [showPermissions, setShowPermissions] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    fetchRolesAndUsers()
  }, [])

  const fetchRolesAndUsers = async () => {
    try {
      setLoading(true)
      // Get predefined roles
      const predefinedRoles = getAllRoles()

      // Fetch user counts by role
      const usersByRoleResponse = await getUsersByRole()
      const roleCounts = usersByRoleResponse.data?.data || {}

      // Calculate total users
      const total = Object.values(roleCounts).reduce((sum, count) => sum + count, 0)
      setTotalUsers(total)

      // Map role keys to match backend format
      const roleKeyMapping = {
        SUPER_ADMIN: "super_admin",
        ADMIN: "admin",
        MANAGER: "manager",
        EMPLOYEE: "employee",
        CASHIER: "cashier",
        CUSTOMER: "customer",
      }

      // Add user counts to roles
      const rolesWithUserCount = predefinedRoles.map((role) => {
        const backendRoleKey = roleKeyMapping[role.key] || role.key.toLowerCase()
        const userCount = roleCounts[backendRoleKey] || roleCounts[role.key] || roleCounts[role.key.toLowerCase()] || 0

        return {
          ...role,
          userCount,
        }
      })

      setRoles(rolesWithUserCount)
    } catch (error) {
      console.error("Error fetching roles and users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch roles and users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadgeColor = (roleKey) => {
    switch (roleKey?.toLowerCase()) {
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

  const handleViewPermissions = (role) => {
    setSelectedRole(role)
    setShowPermissions(true)
  }

  const confirmDelete = (role) => {
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!roleToDelete) return

    try {
      toast({
        title: "Info",
        description: "Predefined roles cannot be deleted. You can only modify custom roles.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error deleting role:", error)
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  const totalRoles = roles.length

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
            <p className="text-muted-foreground">Manage user roles and their permissions</p>
          </div>
          <PermissionGuard permission={PERMISSIONS.MANAGE_ROLES}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Custom Role
            </Button>
          </PermissionGuard>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRoles}</div>
              <p className="text-xs text-muted-foreground">System and custom roles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">All system users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRoles}</div>
              <p className="text-xs text-muted-foreground">Predefined roles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(PERMISSIONS).length}</div>
              <p className="text-xs text-muted-foreground">Available permissions</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Manage system roles and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center space-x-2 mb-4">
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
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        No roles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((role) => (
                      <TableRow key={role.key}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={getRoleBadgeColor(role.key)}>{role.name}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate">{role.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {role.userCount || 0} users
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{role.permissions.length} permissions</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">System</Badge>
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
                              <DropdownMenuItem onClick={() => handleViewPermissions(role)}>
                                <Eye className="mr-2 h-4 w-4" /> View Permissions
                              </DropdownMenuItem>
                              <PermissionGuard permission={PERMISSIONS.MANAGE_ROLES}>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" /> Edit Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={() => confirmDelete(role)}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
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
      </div>

      {/* Permissions Modal */}
      {showPermissions && selectedRole && (
        <AlertDialog open={showPermissions} onOpenChange={setShowPermissions}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {selectedRole.name} Permissions
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedRole.description} - {selectedRole.userCount || 0} users have this role
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedRole.permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span className="text-sm">{permission.replace(/_/g, " ").toLowerCase()}</span>
                  </div>
                ))}
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowPermissions(false)}>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the role &quot;{roleToDelete?.name}&quot;. Users with this role will lose
              their permissions. This action cannot be undone.
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

export default function RolesPage() {
  return (
    <PageGuard roles={["SUPER_ADMIN", "ADMIN"]} permissions={[PERMISSIONS.MANAGE_ROLES]}>
      <RolesPageContent />
    </PageGuard>
  )
}

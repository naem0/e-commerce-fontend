// This file now just exports helper functions
// Actual roles and permissions come from database

export const PERMISSIONS = {
  // Dashboard & Analytics
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_REPORTS: "view_reports",
  VIEW_ANALYTICS: "view_analytics",
  EXPORT_DATA: "export_data",

  // Product Management
  VIEW_PRODUCTS: "view_products",
  CREATE_PRODUCTS: "create_products",
  EDIT_PRODUCTS: "edit_products",
  DELETE_PRODUCTS: "delete_products",
  MANAGE_PRODUCT_CATEGORIES: "manage_product_categories",
  MANAGE_PRODUCT_BRANDS: "manage_product_brands",

  // Order Management
  VIEW_ORDERS: "view_orders",
  CREATE_ORDERS: "create_orders",
  EDIT_ORDERS: "edit_orders",
  DELETE_ORDERS: "delete_orders",
  PROCESS_ORDERS: "process_orders",

  // User Management
  VIEW_USERS: "view_users",
  CREATE_USERS: "create_users",
  EDIT_USERS: "edit_users",
  DELETE_USERS: "delete_users",
  MANAGE_USER_ROLES: "manage_user_roles",

  // Inventory & Suppliers
  VIEW_INVENTORY: "view_inventory",
  MANAGE_INVENTORY: "manage_inventory",
  VIEW_SUPPLIERS: "view_suppliers",
  MANAGE_SUPPLIERS: "manage_suppliers",

  // POS & Sales
  ACCESS_POS: "access_pos",
  PROCESS_SALES: "process_sales",
  MANAGE_CASH_REGISTER: "manage_cash_register",

  // Content & Settings
  MANAGE_SITE_SETTINGS: "manage_site_settings",
  MANAGE_BANNERS: "manage_banners",
  MANAGE_HOME_SETTINGS: "manage_home_settings",
  VIEW_REVIEWS: "view_reviews",
  MODERATE_REVIEWS: "moderate_reviews",

  // System Administration
  MANAGE_ROLES: "manage_roles",
  MANAGE_PERMISSIONS: "manage_permissions",
  VIEW_SYSTEM_LOGS: "view_system_logs",
}

// Role hierarchy for quick checks
export const ROLE_HIERARCHY = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  MANAGER: 80,
  EMPLOYEE: 70,
  CASHIER: 60,
  CUSTOMER: 50,
}

// Helper function to check if a role has permission
export function hasPermission(userRole, permission) {
  // This will be replaced by database check in production
  const rolePermissions = {
    SUPER_ADMIN: ["*"], // All permissions
    ADMIN: Object.values(PERMISSIONS).filter((p) => !p.includes("system")),
    MANAGER: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.CREATE_PRODUCTS,
      PERMISSIONS.EDIT_PRODUCTS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.EDIT_ORDERS,
      PERMISSIONS.PROCESS_ORDERS,
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.MANAGE_INVENTORY,
      PERMISSIONS.VIEW_SUPPLIERS,
      PERMISSIONS.ACCESS_POS,
      PERMISSIONS.PROCESS_SALES,
      PERMISSIONS.MANAGE_CASH_REGISTER,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_REVIEWS,
      PERMISSIONS.MODERATE_REVIEWS,
    ],
    EMPLOYEE: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.ACCESS_POS,
      PERMISSIONS.PROCESS_SALES,
      PERMISSIONS.VIEW_REVIEWS,
    ],
    CASHIER: [PERMISSIONS.ACCESS_POS, PERMISSIONS.PROCESS_SALES, PERMISSIONS.VIEW_PRODUCTS, PERMISSIONS.VIEW_INVENTORY],
    CUSTOMER: [],
  }

  const permissions = rolePermissions[userRole?.toUpperCase()] || []
  return permissions.includes("*") || permissions.includes(permission)
}

// Helper function to check if role has any of the permissions
export function hasAnyPermission(userRole, permissions) {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

// Helper function to check if role has all permissions
export function hasAllPermissions(userRole, permissions) {
  return permissions.every((permission) => hasPermission(userRole, permission))
}

// Get all permissions for a role
export function getRolePermissions(roleName) {
  const rolePermissions = {
    SUPER_ADMIN: ["*"],
    ADMIN: Object.values(PERMISSIONS).filter((p) => !p.includes("system")),
    MANAGER: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.CREATE_PRODUCTS,
      PERMISSIONS.EDIT_PRODUCTS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.EDIT_ORDERS,
      PERMISSIONS.PROCESS_ORDERS,
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.MANAGE_INVENTORY,
      PERMISSIONS.VIEW_SUPPLIERS,
      PERMISSIONS.ACCESS_POS,
      PERMISSIONS.PROCESS_SALES,
      PERMISSIONS.MANAGE_CASH_REGISTER,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_REVIEWS,
      PERMISSIONS.MODERATE_REVIEWS,
    ],
    EMPLOYEE: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.ACCESS_POS,
      PERMISSIONS.PROCESS_SALES,
      PERMISSIONS.VIEW_REVIEWS,
    ],
    CASHIER: [PERMISSIONS.ACCESS_POS, PERMISSIONS.PROCESS_SALES, PERMISSIONS.VIEW_PRODUCTS, PERMISSIONS.VIEW_INVENTORY],
    CUSTOMER: [],
  }

  return rolePermissions[roleName?.toUpperCase()] || []
}

// Get all roles with their details (for static display)
export function getAllRoles() {
  return [
    {
      key: "SUPER_ADMIN",
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: ["*"],
      color: "#9333EA",
      priority: 100,
    },
    {
      key: "ADMIN",
      name: "Admin",
      description: "Administrative access with most permissions",
      permissions: Object.values(PERMISSIONS).filter((p) => !p.includes("system")),
      color: "#DC2626",
      priority: 90,
    },
    {
      key: "MANAGER",
      name: "Manager",
      description: "Management level access",
      permissions: getRolePermissions("MANAGER"),
      color: "#2563EB",
      priority: 80,
    },
    {
      key: "EMPLOYEE",
      name: "Employee",
      description: "Basic employee access",
      permissions: getRolePermissions("EMPLOYEE"),
      color: "#16A34A",
      priority: 70,
    },
    {
      key: "CASHIER",
      name: "Cashier",
      description: "POS and sales access",
      permissions: getRolePermissions("CASHIER"),
      color: "#CA8A04",
      priority: 60,
    },
    {
      key: "CUSTOMER",
      name: "Customer",
      description: "Customer access",
      permissions: [],
      color: "#6B7280",
      priority: 50,
    },
  ]
}

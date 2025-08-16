// Permission constants
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "view_dashboard",

  // Products
  VIEW_PRODUCTS: "view_products",
  CREATE_PRODUCTS: "create_products",
  EDIT_PRODUCTS: "edit_products",
  DELETE_PRODUCTS: "delete_products",
  MANAGE_PRODUCT_CATEGORIES: "manage_product_categories",
  MANAGE_PRODUCT_BRANDS: "manage_product_brands",

  // Orders
  VIEW_ORDERS: "view_orders",
  CREATE_ORDERS: "create_orders",
  EDIT_ORDERS: "edit_orders",
  DELETE_ORDERS: "delete_orders",
  PROCESS_ORDERS: "process_orders",

  // Users
  VIEW_USERS: "view_users",
  CREATE_USERS: "create_users",
  EDIT_USERS: "edit_users",
  DELETE_USERS: "delete_users",
  MANAGE_USER_ROLES: "manage_user_roles",

  // Inventory
  VIEW_INVENTORY: "view_inventory",
  MANAGE_INVENTORY: "manage_inventory",
  VIEW_SUPPLIERS: "view_suppliers",
  MANAGE_SUPPLIERS: "manage_suppliers",

  // POS
  ACCESS_POS: "access_pos",
  PROCESS_SALES: "process_sales",
  MANAGE_CASH_REGISTER: "manage_cash_register",

  // Reports & Analytics
  VIEW_REPORTS: "view_reports",
  VIEW_ANALYTICS: "view_analytics",
  EXPORT_DATA: "export_data",

  // Settings
  MANAGE_SITE_SETTINGS: "manage_site_settings",
  MANAGE_BANNERS: "manage_banners",
  MANAGE_HOME_SETTINGS: "manage_home_settings",

  // Reviews
  VIEW_REVIEWS: "view_reviews",
  MODERATE_REVIEWS: "moderate_reviews",

  // System
  MANAGE_ROLES: "manage_roles",
  MANAGE_PERMISSIONS: "manage_permissions",
  VIEW_SYSTEM_LOGS: "view_system_logs",
}

// Role definitions with their permissions
export const ROLES = {
  SUPER_ADMIN: {
    name: "Super Admin",
    description: "Full system access",
    permissions: Object.values(PERMISSIONS),
  },
  ADMIN: {
    name: "Admin",
    description: "Administrative access",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.CREATE_PRODUCTS,
      PERMISSIONS.EDIT_PRODUCTS,
      PERMISSIONS.DELETE_PRODUCTS,
      PERMISSIONS.MANAGE_PRODUCT_CATEGORIES,
      PERMISSIONS.MANAGE_PRODUCT_BRANDS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.CREATE_ORDERS,
      PERMISSIONS.EDIT_ORDERS,
      PERMISSIONS.PROCESS_ORDERS,
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.CREATE_USERS,
      PERMISSIONS.EDIT_USERS,
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.MANAGE_INVENTORY,
      PERMISSIONS.VIEW_SUPPLIERS,
      PERMISSIONS.MANAGE_SUPPLIERS,
      PERMISSIONS.ACCESS_POS,
      PERMISSIONS.PROCESS_SALES,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.EXPORT_DATA,
      PERMISSIONS.MANAGE_SITE_SETTINGS,
      PERMISSIONS.MANAGE_BANNERS,
      PERMISSIONS.MANAGE_HOME_SETTINGS,
      PERMISSIONS.VIEW_REVIEWS,
      PERMISSIONS.MODERATE_REVIEWS,
    ],
  },
  MANAGER: {
    name: "Manager",
    description: "Management level access",
    permissions: [
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
  },
  EMPLOYEE: {
    name: "Employee",
    description: "Basic employee access",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.ACCESS_POS,
      PERMISSIONS.PROCESS_SALES,
      PERMISSIONS.VIEW_REVIEWS,
    ],
  },
  CASHIER: {
    name: "Cashier",
    description: "POS and sales access",
    permissions: [
      PERMISSIONS.ACCESS_POS,
      PERMISSIONS.PROCESS_SALES,
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.VIEW_INVENTORY,
    ],
  },
  CUSTOMER: {
    name: "Customer",
    description: "Customer access",
    permissions: [],
  },
}

// Helper functions
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false

  const role = ROLES[userRole.toUpperCase()]
  if (!role) return false

  return role.permissions.includes(permission)
}

export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false

  return permissions.some((permission) => hasPermission(userRole, permission))
}

export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false

  return permissions.every((permission) => hasPermission(userRole, permission))
}

export const getRolePermissions = (roleName) => {
  const role = ROLES[roleName?.toUpperCase()]
  return role ? role.permissions : []
}

export const getAllRoles = () => {
  return Object.keys(ROLES).map((key) => ({
    key,
    ...ROLES[key],
  }))
}

const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Permission = require("../backend/models/Permission")
const Role = require("../backend/models/Role")

dotenv.config()

const seedPermissionsAndRoles = async () => {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected")

    // Clear existing data
    console.log("Clearing existing permissions and roles...")
    await Permission.deleteMany({})
    await Role.deleteMany({})

    // Define default permissions
    const defaultPermissions = [
      // Dashboard & Analytics
      {
        name: "view_dashboard",
        displayName: "View Dashboard",
        description: "Access to main dashboard",
        category: "Dashboard",
        isSystem: true,
      },
      {
        name: "view_reports",
        displayName: "View Reports",
        description: "Access to view reports",
        category: "Reports",
        isSystem: true,
      },
      {
        name: "view_analytics",
        displayName: "View Analytics",
        description: "Access to analytics and insights",
        category: "Dashboard",
        isSystem: true,
      },
      {
        name: "export_data",
        displayName: "Export Data",
        description: "Export data to CSV/Excel",
        category: "Reports",
        isSystem: true,
      },

      // Product Management
      {
        name: "view_products",
        displayName: "View Products",
        description: "View product listings",
        category: "Products",
        isSystem: true,
      },
      {
        name: "create_products",
        displayName: "Create Products",
        description: "Create new products",
        category: "Products",
        isSystem: true,
      },
      {
        name: "edit_products",
        displayName: "Edit Products",
        description: "Edit existing products",
        category: "Products",
        isSystem: true,
      },
      {
        name: "delete_products",
        displayName: "Delete Products",
        description: "Delete products",
        category: "Products",
        isSystem: true,
      },
      {
        name: "manage_product_categories",
        displayName: "Manage Categories",
        description: "Manage product categories",
        category: "Products",
        isSystem: true,
      },
      {
        name: "manage_product_brands",
        displayName: "Manage Brands",
        description: "Manage product brands",
        category: "Products",
        isSystem: true,
      },

      // Order Management
      {
        name: "view_orders",
        displayName: "View Orders",
        description: "View order listings",
        category: "Orders",
        isSystem: true,
      },
      {
        name: "create_orders",
        displayName: "Create Orders",
        description: "Create new orders",
        category: "Orders",
        isSystem: true,
      },
      {
        name: "edit_orders",
        displayName: "Edit Orders",
        description: "Edit existing orders",
        category: "Orders",
        isSystem: true,
      },
      {
        name: "delete_orders",
        displayName: "Delete Orders",
        description: "Delete orders",
        category: "Orders",
        isSystem: true,
      },
      {
        name: "process_orders",
        displayName: "Process Orders",
        description: "Process and fulfill orders",
        category: "Orders",
        isSystem: true,
      },

      // User Management
      {
        name: "view_users",
        displayName: "View Users",
        description: "View user listings",
        category: "Users",
        isSystem: true,
      },
      {
        name: "create_users",
        displayName: "Create Users",
        description: "Create new users",
        category: "Users",
        isSystem: true,
      },
      {
        name: "edit_users",
        displayName: "Edit Users",
        description: "Edit existing users",
        category: "Users",
        isSystem: true,
      },
      {
        name: "delete_users",
        displayName: "Delete Users",
        description: "Delete users",
        category: "Users",
        isSystem: true,
      },
      {
        name: "manage_user_roles",
        displayName: "Manage User Roles",
        description: "Assign roles to users",
        category: "Users",
        isSystem: true,
      },

      // Inventory & Suppliers
      {
        name: "view_inventory",
        displayName: "View Inventory",
        description: "View inventory levels",
        category: "Inventory",
        isSystem: true,
      },
      {
        name: "manage_inventory",
        displayName: "Manage Inventory",
        description: "Update inventory levels",
        category: "Inventory",
        isSystem: true,
      },
      {
        name: "view_suppliers",
        displayName: "View Suppliers",
        description: "View supplier listings",
        category: "Inventory",
        isSystem: true,
      },
      {
        name: "manage_suppliers",
        displayName: "Manage Suppliers",
        description: "Create and edit suppliers",
        category: "Inventory",
        isSystem: true,
      },

      // POS & Sales
      {
        name: "access_pos",
        displayName: "Access POS",
        description: "Access point of sale system",
        category: "POS",
        isSystem: true,
      },
      {
        name: "process_sales",
        displayName: "Process Sales",
        description: "Process sales transactions",
        category: "POS",
        isSystem: true,
      },
      {
        name: "manage_cash_register",
        displayName: "Manage Cash Register",
        description: "Manage cash register operations",
        category: "POS",
        isSystem: true,
      },

      // Content & Settings
      {
        name: "manage_site_settings",
        displayName: "Manage Site Settings",
        description: "Configure site settings",
        category: "Settings",
        isSystem: true,
      },
      {
        name: "manage_banners",
        displayName: "Manage Banners",
        description: "Create and edit banners",
        category: "Content",
        isSystem: true,
      },
      {
        name: "manage_home_settings",
        displayName: "Manage Home Settings",
        description: "Configure home page settings",
        category: "Content",
        isSystem: true,
      },
      {
        name: "view_reviews",
        displayName: "View Reviews",
        description: "View product reviews",
        category: "Content",
        isSystem: true,
      },
      {
        name: "moderate_reviews",
        displayName: "Moderate Reviews",
        description: "Approve or reject reviews",
        category: "Content",
        isSystem: true,
      },

      // System Administration
      {
        name: "manage_roles",
        displayName: "Manage Roles",
        description: "Create and edit roles",
        category: "System",
        isSystem: true,
      },
      {
        name: "manage_permissions",
        displayName: "Manage Permissions",
        description: "Create and edit permissions",
        category: "System",
        isSystem: true,
      },
      {
        name: "view_system_logs",
        displayName: "View System Logs",
        description: "Access system logs",
        category: "System",
        isSystem: true,
      },
    ]

    // Seed permissions
    console.log("Seeding permissions...")
    const createdPermissions = await Permission.insertMany(defaultPermissions)
    console.log(`${createdPermissions.length} permissions created`)

    // Get all permission names
    const allPermissionNames = createdPermissions.map((p) => p.name)

    // Define default roles
    const defaultRoles = [
      {
        name: "SUPER_ADMIN",
        displayName: "Super Admin",
        description: "Full system access with all permissions",
        permissions: allPermissionNames,
        color: "#9333EA",
        priority: 100,
        isSystem: true,
      },
      {
        name: "ADMIN",
        displayName: "Admin",
        description: "Administrative access with most permissions",
        permissions: allPermissionNames.filter((p) => !p.includes("system")),
        color: "#DC2626",
        priority: 90,
        isSystem: true,
      },
      {
        name: "MANAGER",
        displayName: "Manager",
        description: "Management level access",
        permissions: [
          "view_dashboard",
          "view_products",
          "create_products",
          "edit_products",
          "view_orders",
          "edit_orders",
          "process_orders",
          "view_users",
          "view_inventory",
          "manage_inventory",
          "view_suppliers",
          "access_pos",
          "process_sales",
          "manage_cash_register",
          "view_reports",
          "view_analytics",
          "view_reviews",
          "moderate_reviews",
        ],
        color: "#2563EB",
        priority: 80,
        isSystem: true,
      },
      {
        name: "EMPLOYEE",
        displayName: "Employee",
        description: "Basic employee access",
        permissions: [
          "view_dashboard",
          "view_products",
          "view_orders",
          "view_inventory",
          "access_pos",
          "process_sales",
          "view_reviews",
        ],
        color: "#16A34A",
        priority: 70,
        isSystem: true,
      },
      {
        name: "CASHIER",
        displayName: "Cashier",
        description: "POS and sales access",
        permissions: ["access_pos", "process_sales", "view_products", "view_inventory"],
        color: "#CA8A04",
        priority: 60,
        isSystem: true,
      },
      {
        name: "CUSTOMER",
        displayName: "Customer",
        description: "Customer access",
        permissions: [],
        color: "#6B7280",
        priority: 50,
        isSystem: true,
      },
    ]

    // Seed roles
    console.log("Seeding roles...")
    const createdRoles = await Role.insertMany(defaultRoles)
    console.log(`${createdRoles.length} roles created`)

    console.log("Seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Seeding error:", error)
    process.exit(1)
  }
}

seedPermissionsAndRoles()

import { AdminLayout } from "@/components/admin/admin-layout"
import { PageGuard } from "@/components/page-guard"
import { PERMISSIONS } from "@/lib/permissions"

export const metadata = {
  title: "Admin Panel",
  description: "Admin dashboard for the e-commerce platform",
}

export default function Layout({ children }) {
  return (
    <PageGuard
      roles={["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE", "CASHIER"]}
      permissions={[PERMISSIONS.VIEW_DASHBOARD]}
    >
      <AdminLayout>
        {children}
      </AdminLayout>
    </PageGuard>
  )
}
import { AdminLayout } from "@/components/admin/admin-layout"
export const metadata = {
  title: "Admin Panel",
  description: "Admin dashboard for the e-commerce platform",
}

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>
}

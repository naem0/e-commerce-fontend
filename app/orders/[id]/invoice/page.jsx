"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Download, Printer, ArrowLeft } from "lucide-react"
import { getOrderById } from "@/services/order.service"
import { getSiteSettings } from "@/services/settings.service"
import Invoice from "@/components/invoice"

export default function UserInvoicePage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const invoiceRef = useRef()

  const [order, setOrder] = useState(null)
  const [siteSettings, setSiteSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [status, id])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch order
      const orderResponse = await getOrderById(id)
      if (orderResponse.success) {
        // Check if user owns this order
        if (orderResponse.order.user._id !== session.user.id) {
          throw new Error("Unauthorized access")
        }
        setOrder(orderResponse.order)
      } else {
        throw new Error(orderResponse.message || "Order not found")
      }

      // Fetch site settings
      const settingsResponse = await getSiteSettings()
      if (settingsResponse.success) {
        setSiteSettings(settingsResponse.settings)
      }
    } catch (error) {
      console.error("Fetch data error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load invoice",
        variant: "destructive",
      })
      router.push("/orders")
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    const invoiceContent = invoiceRef.current.innerHTML
    invoiceContent.print()
  }

  const handleDownload = async () => {
    try {
      // Create a new window with the invoice content
      const printWindow = window.open("", "_blank")
      const invoiceContent = invoiceRef.current.innerHTML

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice-${order._id.slice(-8).toUpperCase()}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .print\\:hidden { display: none !important; }
              @media print {
                body { margin: 0; padding: 0; }
                .print\\:p-0 { padding: 0 !important; }
              }
            </style>
          </head>
          <body>
            ${invoiceContent}
          </body>
        </html>
      `)

      printWindow.document.close()
      printWindow.focus()

      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download invoice",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invoice not found</h1>
          <Button onClick={() => router.push("/orders")}>Back to Orders</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push(`/orders/${id}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Order
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice */}
      <div className="container mx-auto px-4 py-8 print:p-0">
        <div ref={invoiceRef}>
          <Invoice order={order} siteSettings={siteSettings} />
        </div>
      </div>
    </div>
  )
}

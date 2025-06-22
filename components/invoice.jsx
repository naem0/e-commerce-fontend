"use client"

import { Badge } from "@/components/ui/badge"

export default function Invoice({ order, siteSettings }) {
  if (!order) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString()}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none p-8 print:p-0">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-8 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{siteSettings?.siteName || "Your Store"}</h1>
            <p className="text-gray-600 mt-2">{siteSettings?.address || "Store Address"}</p>
            <p className="text-gray-600">
              Phone: {siteSettings?.phone || "N/A"} | Email: {siteSettings?.email || "N/A"}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-gray-600 mt-2">Invoice #: {order._id.slice(-8).toUpperCase()}</p>
            <p className="text-gray-600">Date: {formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Customer & Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To:</h3>
          <div className="text-gray-600">
            <p className="font-medium">{order.user.name}</p>
            <p>{order.user.email}</p>
            <p>{order.user.phone}</p>
            <div className="mt-2">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p>{order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details:</h3>
          <div className="text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Order Status:</span>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>{order.paymentMethod}</span>
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between">
                <span>Tracking Number:</span>
                <span className="font-mono">{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items:</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      {item.variation && <p className="text-sm text-gray-600">Variation: {item.variation.name}</p>}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {order.payments && order.payments.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Method</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {order.payments.map((payment, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(payment.date)}</td>
                    <td className="border border-gray-300 px-4 py-2">{payment.method}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payment.amount)}</td>
                    <td className="border border-gray-300 px-4 py-2">{payment.transactionId || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Summary */}
          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between">
                <span>Total Paid:</span>
                <span className="text-green-600 font-medium">
                  {formatCurrency(order.payments.reduce((sum, p) => sum + p.amount, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Due Amount:</span>
                <span className="text-red-600 font-medium">
                  {formatCurrency(order.total - order.payments.reduce((sum, p) => sum + p.amount, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-8 text-center text-gray-600">
        <p>Thank you for your business!</p>
        <p className="text-sm mt-2">This is a computer-generated invoice. No signature required.</p>
      </div>
    </div>
  )
}

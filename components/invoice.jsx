"use client"

import { Badge } from "@/components/ui/badge"
import Image from "next/image"

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

  const companyLogo = siteSettings?.logo || ""
  const companyName = siteSettings?.siteName || "Equal Fashion"

  const companyAddress = siteSettings?.contactInfo?.address || "Uttara, Dhaka, Bangladesh"
  const companyPhone = siteSettings?.contactInfo?.phone || "09658-405962"
  const companyEmail = siteSettings?.contactInfo?.email || "info@equalfashion.com"

  return (
    <div className="max-w-4xl mx-auto bg-white text-slate-900 shadow-lg print:shadow-none p-6 md:p-8 print:p-8">
      {/* Header */}
      <div className="border-b-2 border-slate-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            {
              companyLogo ? (
                <Image src={process.env.NEXT_PUBLIC_BASE_URL + companyLogo} alt={companyName} width={150} height={50} />
              ) : (
                <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">{companyName}</h1>
              )
            }
            <p className="text-slate-600 mt-1 text-sm font-medium">{companyAddress}</p>
            <p className="text-slate-600 text-sm">
              <span className="font-semibold text-slate-800">Phone:</span> {companyPhone} | <span className="font-semibold text-slate-800">Email:</span> {companyEmail}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-slate-900">INVOICE</h2>
            <p className="text-slate-600 mt-1 text-sm">Invoice #: <span className="font-mono font-bold text-slate-800">{order.orderNumber || order._id.slice(-8).toUpperCase()}</span></p>
            <p className="text-slate-600 text-sm">Date: <span className="font-medium text-slate-800">{formatDate(order.createdAt)}</span></p>
          </div>
        </div>
      </div>

      {/* Customer & Order Info */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">Bill To:</h3>
          <div className="text-slate-700 text-sm space-y-0.5">
            <p className="font-bold text-slate-900">{order.shippingAddress?.name || order.user?.name}</p>
            <p>{order.shippingAddress?.phone || order.user?.phone}</p>
            <p>{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}{order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ""}</p>
            <p>{order.shippingAddress?.country}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1 text-right">Order Info:</h3>
          <div className="text-slate-700 text-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Order Status:</span>
              <Badge className={`${getStatusColor(order.status)} border-none shadow-none text-[10px] py-0 h-5`}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Status:</span>
              <Badge className={`${getPaymentStatusColor(order.paymentStatus)} border-none shadow-none text-[10px] py-0 h-5`}>
                {order.paymentStatus.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-medium uppercase">{order.paymentMethod.replace("_", " ")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-widest border-y border-slate-200">
              <th className="px-4 py-3 text-left font-bold">Item Description</th>
              <th className="px-4 py-3 text-center font-bold">Qty</th>
              <th className="px-4 py-3 text-right font-bold">Price</th>
              <th className="px-4 py-3 text-right font-bold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item, index) => (
              <tr key={index} className="text-slate-700">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    {item.variation && (
                      <p className="text-[11px] text-slate-500 italic">
                        {item.variation.options?.map(o => `${o.type}: ${o.value}`).join(", ")}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{item.quantity}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                <td className="px-4 py-3 text-right font-bold">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-[250px]">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="text-slate-900">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping:</span>
              <span className="text-slate-900">{formatCurrency(order.shippingCost)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="border-t-2 border-slate-900 pt-2 flex justify-between font-black text-lg text-slate-900">
              <span>TOTAL:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-6 mt-auto">
        <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-500">
          <div>
            <p className="font-bold text-slate-700 uppercase mb-1">Notes:</p>
            <p>Thank you for shopping with Equal Fashion. Please keep this invoice for your records. For any queries, call us at {companyPhone}.</p>
          </div>
          <div className="text-right flex flex-col justify-end">
            <p className="font-bold text-slate-900 text-sm">Authorized Signature</p>
            <div className="mt-4 border-t border-slate-400 w-32 ml-auto"></div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest print:hidden">
        Powered by Equal Fashion
      </div>
    </div>
  )
}


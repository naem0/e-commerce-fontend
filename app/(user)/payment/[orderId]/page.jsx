"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, CheckCircle, Upload, X } from "lucide-react"
import { formatPrice } from "@/services/utils"
import { getOrderById, addPartialPayment } from "@/services/order.service"

export default function PaymentPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    amount: "",
    accountNumber: "",
    transactionId: "",
    screenshot: null,
    notes: "",
  })
  const [screenshotPreview, setScreenshotPreview] = useState(null)

  useEffect(() => {
    if (!session) {
      router.push("/auth/login")
      return
    }

    fetchOrder()
  }, [session, orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await getOrderById(orderId)

      if (response.success) {
        setOrder(response.order)
        // Pre-fill amount with due amount
        const dueAmount = response.order.total - (response.order.paidAmount || 0)
        setPaymentData((prev) => ({
          ...prev,
          amount: dueAmount.toString(),
        }))
      } else {
        throw new Error(response.message || "Order not found")
      }
    } catch (error) {
      console.error("Fetch order error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load order",
        variant: "destructive",
      })
      router.push("/orders")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "Screenshot size should be less than 5MB",
          variant: "destructive",
        })
        return
      }

      setPaymentData((prev) => ({
        ...prev,
        screenshot: file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setScreenshotPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeScreenshot = () => {
    setPaymentData((prev) => ({
      ...prev,
      screenshot: null,
    }))
    setScreenshotPreview(null)
  }

  const handlePayment = async () => {
    const amount = Number.parseFloat(paymentData.amount)
    const dueAmount = order.total - (order.paidAmount || 0)

    if (!amount || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      })
      return
    }

    if (amount > dueAmount) {
      toast({
        title: "Error",
        description: `Payment amount cannot exceed due amount of ${formatPrice(dueAmount)}`,
        variant: "destructive",
      })
      return
    }

    if (!paymentData.accountNumber.trim()) {
      toast({
        title: "Error",
        description: "Account number is required",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("amount", amount.toString())
      formData.append("method", order.paymentMethod)
      formData.append("accountNumber", paymentData.accountNumber)
      if (paymentData.transactionId) {
        formData.append("transactionId", paymentData.transactionId)
      }
      if (paymentData.screenshot) {
        formData.append("screenshot", paymentData.screenshot)
      }
      if (paymentData.notes) {
        formData.append("notes", paymentData.notes)
      }

      const response = await addPartialPayment(orderId, formData)

      if (response.success) {
        toast({
          title: "Payment Submitted!",
          description:
            amount >= dueAmount
              ? "Your full payment has been submitted for verification."
              : `Partial payment of ${formatPrice(amount)} submitted. Remaining: ${formatPrice(dueAmount - amount)}`,
        })

        // Refresh order data
        await fetchOrder()

        // Redirect to order details after 2 seconds
        setTimeout(() => {
          router.push(`/orders/${orderId}`)
        }, 2000)
      } else {
        throw new Error(response.message || "Payment submission failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Error",
        description: error.message || "Payment submission failed",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary-custom" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Button onClick={() => router.push("/orders")}>View Orders</Button>
        </div>
      </div>
    )
  }

  const dueAmount = order.total - (order.paidAmount || 0)

  // If fully paid, show success message
  if (dueAmount <= 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Completed</h1>
            <p className="text-gray-600 mb-4">This order has been fully paid.</p>
            <Button onClick={() => router.push(`/orders/${orderId}`)}>View Order Details</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getPaymentInstructions = () => {
    switch (order.paymentMethod) {
      case "bkash":
        return {
          title: "bKash Payment Instructions",
          instructions: [
            "Open your bKash app or dial *247#",
            "Select 'Send Money'",
            "Enter Merchant Number: 01712345678",
            `Enter Amount: ${paymentData.amount ? formatPrice(Number.parseFloat(paymentData.amount)) : formatPrice(dueAmount)}`,
            "Enter your bKash PIN to confirm",
            "Save the transaction ID and screenshot",
            "Fill the form below with your payment details",
          ],
        }
      case "nagad":
        return {
          title: "Nagad Payment Instructions",
          instructions: [
            "Open your Nagad app or dial *167#",
            "Select 'Send Money'",
            "Enter Merchant Number: 01712345678",
            `Enter Amount: ${paymentData.amount ? formatPrice(Number.parseFloat(paymentData.amount)) : formatPrice(dueAmount)}`,
            "Enter your Nagad PIN to confirm",
            "Save the transaction ID and screenshot",
            "Fill the form below with your payment details",
          ],
        }
      default:
        return {
          title: "Payment Instructions",
          instructions: ["Please follow the payment instructions"],
        }
    }
  }

  const paymentInstructions = getPaymentInstructions()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Payment</h1>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Order Number</span>
                <span className="font-mono">#{order._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="capitalize">{order.paymentMethod.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid Amount</span>
                <span className="text-green-600">{formatPrice(order.paidAmount || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-red-600">
                <span>Due Amount</span>
                <span>{formatPrice(dueAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              {paymentInstructions.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {paymentInstructions.instructions.map((instruction, index) => (
                <li key={index} className="text-sm">
                  {instruction}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Payment Amount *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={dueAmount}
                value={paymentData.amount}
                onChange={handleInputChange}
                placeholder="Enter payment amount"
                required
              />
              <p className="text-sm text-gray-500 mt-1">You can pay partially. Maximum: {formatPrice(dueAmount)}</p>
            </div>

            <div>
              <Label htmlFor="accountNumber">Your Account Number *</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={paymentData.accountNumber}
                onChange={handleInputChange}
                placeholder="01XXXXXXXXX"
                required
              />
            </div>

            <div>
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                name="transactionId"
                value={paymentData.transactionId}
                onChange={handleInputChange}
                placeholder="Enter transaction ID (optional)"
              />
            </div>

            <div>
              <Label htmlFor="screenshot">Payment Screenshot (Optional)</Label>
              <div className="mt-2">
                {!screenshotPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="screenshot" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">Upload payment screenshot</span>
                        <input
                          id="screenshot"
                          name="screenshot"
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={screenshotPreview || "/placeholder.svg"}
                      alt="Payment screenshot"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeScreenshot}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={paymentData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information about this payment"
                rows={3}
              />
            </div>

            <Button
              onClick={handlePayment}
              className="w-full"
              disabled={processing || !paymentData.amount || !paymentData.accountNumber}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Payment
                </>
              )}
            </Button>

            <div className="text-center">
              <Button variant="outline" onClick={() => router.push(`/orders/${orderId}`)} className="mt-2">
                Back to Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

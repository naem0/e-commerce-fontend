"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { formatPrice } from "@/services/utils"
import { addPartialPayment } from "@/services/order.service"

export function PartialPaymentModal({ isOpen, onClose, orderId, dueAmount, onPaymentAdded }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "",
    transactionId: "",
    notes: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!paymentForm.amount || !paymentForm.method) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(paymentForm.amount)
    if (amount <= 0 || amount > dueAmount) {
      toast({
        title: "Error",
        description: `Payment amount must be between 0 and ${formatPrice(dueAmount)}`,
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const response = await addPartialPayment(orderId, {
        amount,
        method: paymentForm.method,
        transactionId: paymentForm.transactionId,
        notes: paymentForm.notes,
      })

      if (response.success) {
        toast({
          title: "Success",
          description: "Payment added successfully",
        })

        // Reset form
        setPaymentForm({
          amount: "",
          method: "",
          transactionId: "",
          notes: "",
        })

        onClose()
        onPaymentAdded()
      } else {
        throw new Error(response.message || "Failed to add payment")
      }
    } catch (error) {
      console.error("Add payment error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add payment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Partial Payment</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Due Amount</p>
          <p className="text-lg font-bold">{formatPrice(dueAmount)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Payment Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={dueAmount}
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              placeholder="Enter payment amount"
              required
            />
          </div>

          <div>
            <Label htmlFor="method">Payment Method *</Label>
            <Select
              value={paymentForm.method}
              onValueChange={(value) => setPaymentForm({ ...paymentForm, method: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bkash">bKash</SelectItem>
                <SelectItem value="nagad">Nagad</SelectItem>
                <SelectItem value="rocket">Rocket</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              value={paymentForm.transactionId}
              onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
              placeholder="Enter transaction ID (if applicable)"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              placeholder="Additional notes about this payment"
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

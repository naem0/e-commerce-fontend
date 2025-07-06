"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Loader2 } from "lucide-react"
import { addProductReview } from "@/services/review.service"

export function ReviewModal({ isOpen, onClose, product, orderId }) {
  const { t } = useLanguage()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
    title: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRatingChange = (rating) => {
    setReviewData((prev) => ({
      ...prev,
      rating,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (reviewData.rating === 0) {
      toast({
        title: t("review.error") || "Error",
        description: t("review.ratingRequired") || "Please select a rating",
        variant: "destructive",
      })
      return
    }

    if (!reviewData.comment.trim()) {
      toast({
        title: t("review.error") || "Error",
        description: t("review.commentRequired") || "Please write a comment",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await addProductReview(product._id, {
        ...reviewData,
        orderId,
      })

      if (response.success) {
        toast({
          title: t("review.success") || "Review Submitted!",
          description: t("review.successDesc") || "Thank you for your review.",
        })
        onClose()
      } else {
        throw new Error(response.message || "Failed to submit review")
      }
    } catch (error) {
      console.error("Review submission error:", error)
      toast({
        title: t("review.error") || "Error",
        description: error.message || "Failed to submit review",
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
          <DialogTitle>{t("review.writeReview") || "Write a Review"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Info */}
          <div className="text-center">
            <h3 className="font-medium">{product.name}</h3>
          </div>

          {/* Rating */}
          <div>
            <Label>{t("review.rating") || "Rating"} *</Label>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= reviewData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <Label htmlFor="title">{t("review.title") || "Review Title"}</Label>
            <Input
              id="title"
              name="title"
              value={reviewData.title}
              onChange={handleInputChange}
              placeholder={t("review.titlePlaceholder") || "Summarize your review"}
            />
          </div>

          {/* Review Comment */}
          <div>
            <Label htmlFor="comment">{t("review.comment") || "Your Review"} *</Label>
            <Textarea
              id="comment"
              name="comment"
              value={reviewData.comment}
              onChange={handleInputChange}
              placeholder={t("review.commentPlaceholder") || "Tell others about your experience with this product"}
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t("review.cancel") || "Cancel"}
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("review.submitting") || "Submitting..."}
                </>
              ) : (
                t("review.submit") || "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

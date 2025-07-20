"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Star, Check, X, Trash2, MessageSquare, Filter, Search } from "lucide-react"
import { formatDate } from "@/services/utils"
import { getAllReviews, updateReviewStatus, addAdminResponse, deleteReview } from "@/services/review.service"

export default function AdminReviewsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [selectedReview, setSelectedReview] = useState(null)
  const [responseText, setResponseText] = useState("")
  const [responseLoading, setResponseLoading] = useState(false)

  // Filters
  const [filters, setFilters] = useState({
    status: "all", // Updated default value to "all"
    search: "",
    page: 1,
    limit: 10,
  })

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user?.role || session.user.role !== "admin") {
      router.push("/auth/login")
      return
    }
    fetchReviews()
  }, [status, session, filters])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await getAllReviews(filters)

      if (response.success) {
        setReviews(response.reviews)
        setPagination({
          total: response.total,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        })
      } else {
        throw new Error(response.message || "Failed to fetch reviews")
      }
    } catch (error) {
      console.error("Fetch reviews error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (reviewId, newStatus) => {
    try {
      setActionLoading(reviewId)
      const response = await updateReviewStatus(reviewId, newStatus)

      if (response.success) {
        setReviews((prev) =>
          prev.map((review) => (review._id === reviewId ? { ...review, status: newStatus } : review)),
        )
        toast({
          title: "Success",
          description: `Review ${newStatus} successfully`,
        })
      } else {
        throw new Error(response.message || "Failed to update review status")
      }
    } catch (error) {
      console.error("Update status error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update review status",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddResponse = async (e) => {
    e.preventDefault()
    if (!responseText.trim()) return

    try {
      setResponseLoading(true)
      const response = await addAdminResponse(selectedReview._id, responseText)

      if (response.success) {
        setReviews((prev) =>
          prev.map((review) =>
            review._id === selectedReview._id ? { ...review, adminResponse: response.review.adminResponse } : review,
          ),
        )
        setResponseText("")
        setSelectedReview(null)
        toast({
          title: "Success",
          description: "Response added successfully",
        })
      } else {
        throw new Error(response.message || "Failed to add response")
      }
    } catch (error) {
      console.error("Add response error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add response",
        variant: "destructive",
      })
    } finally {
      setResponseLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      setActionLoading(reviewId)
      const response = await deleteReview(reviewId)

      if (response.success) {
        setReviews((prev) => prev.filter((review) => review._id !== reviewId))
        toast({
          title: "Success",
          description: "Review deleted successfully",
        })
      } else {
        throw new Error(response.message || "Failed to delete review")
      }
    } catch (error) {
      console.error("Delete review error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Review Management</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value, page: 1 }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem> {/* Updated value prop */}
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No reviews found</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image
                        src={
                          review.product?.images?.[0]
                            ? process.env.NEXT_PUBLIC_API_URL + review.product.images[0]
                            : "/placeholder.svg?height=48&width=48"
                        }
                        alt={review.product?.name || "Product"}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{review.product?.name}</h3>
                      <p className="text-sm text-gray-600">
                        by {review.user?.name} • {formatDate(review.createdAt)}
                      </p>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <Badge className={getStatusColor(review.status)}>{review.status}</Badge>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-gray-700">{review.comment}</p>
                </div>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {review.images.map((image, index) => (
                      <div key={index} className="relative h-20 w-20">
                        <Image
                          src={process.env.NEXT_PUBLIC_API_URL + image || "/placeholder.svg"}
                          alt={`Review image ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Admin Response */}
                {review.adminResponse && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-800">Admin Response</span>
                    </div>
                    <p className="text-blue-700">{review.adminResponse.message}</p>
                    <p className="text-xs text-blue-600 mt-2">{formatDate(review.adminResponse.respondedAt)}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {review.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(review._id, "approved")}
                        disabled={actionLoading === review._id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {actionLoading === review._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(review._id, "rejected")}
                        disabled={actionLoading === review._id}
                      >
                        {actionLoading === review._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Reject
                      </Button>
                    </>
                  )}

                  {review.status === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(review._id, "rejected")}
                      disabled={actionLoading === review._id}
                    >
                      {actionLoading === review._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Reject
                    </Button>
                  )}

                  {review.status === "rejected" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(review._id, "approved")}
                      disabled={actionLoading === review._id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading === review._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve
                    </Button>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedReview(review)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Respond
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Admin Response</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddResponse} className="space-y-4">
                        <div>
                          <Label htmlFor="response">Your Response</Label>
                          <Textarea
                            id="response"
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Write your response to this review..."
                            rows={4}
                            required
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button type="submit" disabled={responseLoading}>
                            {responseLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Add Response
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this review? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteReview(review._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

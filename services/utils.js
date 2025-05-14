// Get auth header with token from localStorage
export const getAuthHeader = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
  }
  return null
}

// Format price with currency
export const formatPrice = (price, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price)
}

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

// Get error message from error object
export const getErrorMessage = (error) => {
  if (!error) return "An unknown error occurred"

  if (typeof error === "string") return error

  if (error.message) return error.message

  if (error.status && error.status >= 400 && error.status < 500) {
    return error.message || "Client error"
  }

  if (error.status && error.status >= 500) {
    return "Server error. Please try again later."
  }

  return "An unexpected error occurred"
}

import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const getAuthHeaders = async () => {
  try {
    const session = await getSession()
    let token = null
    if (session?.accessToken) {
      token = session.accessToken
    } else if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken")
    }

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    } else {
      return {
        "Content-Type": "application/json",
      }
    }
  } catch (error) {
    return {
      "Content-Type": "application/json",
    }
  }
}

export const getNotifications = async (params = {}) => {
  try {
    const headers = await getAuthHeaders()
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_URL}/api/notifications${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const markAsRead = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/notifications/${id}/read`

    const response = await fetch(url, {
      method: "PUT",
      headers,
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const markAllAsRead = async () => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/notifications/read-all`

    const response = await fetch(url, {
      method: "PUT",
      headers,
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const deleteNotification = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_URL}/api/notifications/${id}`

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
}

export default notificationService

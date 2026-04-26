"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, Loader2, Info, Package, CreditCard, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuHeader,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { notificationService } from "@/services/notification.service"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export function NotificationDropdown() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)
  const router = useRouter()

  const fetchNotifications = async () => {
    if (!session) return
    try {
      setLoading(true)
      const response = await notificationService.getNotifications({ limit: 5 })
      if (response.success) {
        setNotifications(response.notifications)
        setUnreadCount(response.unreadCount)
      }
    } catch (error) {
      console.error("Fetch notifications error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 2 minutes
    const interval = setInterval(fetchNotifications, 120000)
    return () => clearInterval(interval)
  }, [session])

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation()
    try {
      const response = await notificationService.markAsRead(id)
      if (response.success) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Mark as read error:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true)
      const response = await notificationService.markAllAsRead()
      if (response.success) {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Mark all as read error:", error)
    } finally {
      setMarkingAll(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      const response = await notificationService.deleteNotification(id)
      if (response.success) {
        setNotifications(notifications.filter(n => n._id !== id))
        if (!notifications.find(n => n._id === id).read) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error("Delete notification error:", error)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case "order": return <Package className="h-4 w-4 text-blue-500" />
      case "payment": return <CreditCard className="h-4 w-4 text-green-500" />
      case "review": return <Star className="h-4 w-4 text-yellow-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      notificationService.markAsRead(notification._id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  if (!session) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 text-primary-custom hover:text-primary-custom/80"
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
            >
              {markingAll ? <Loader2 className="h-3 w-3 animate-spin" /> : "Mark all as read"}
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                className={`p-4 cursor-pointer flex gap-3 items-start border-b last:border-0 ${!notification.read ? "bg-primary-custom/5" : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mt-1 flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm font-medium leading-none ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px]"
                        onClick={(e) => handleMarkAsRead(notification._id, e)}
                      >
                        <Check className="h-3 w-3 mr-1" /> Mark read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600"
                      onClick={(e) => handleDelete(notification._id, e)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-xs text-gray-500 h-8" onClick={() => router.push("/notifications")}>
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function WelcomeAlertDialog() {
  const [isOpen, setIsOpen] = useState(false) // শুরুতে বন্ধ থাকবে

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedWelcome");
    if (!hasVisited) {
      const openTimer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("hasVisitedWelcome", "true");

        const closeTimer = setTimeout(() => {
          setIsOpen(false);
        }, 5000);

        return () => clearTimeout(closeTimer);
      }, 1500);

      return () => clearTimeout(openTimer);
    }
  }, [])

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to our Store!</AlertDialogTitle>
          <AlertDialogDescription>
            We're glad to have you here. Explore our products and enjoy your shopping!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction>Explore</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
 
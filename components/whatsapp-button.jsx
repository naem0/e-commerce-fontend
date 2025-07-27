"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

export default function WhatsAppButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="https://wa.me/8801310881055?text=Hello!%20I%20have%20a%20question"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300"
          >
            <MessageCircle className="w-6 h-6" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left">
          Chat with us on WhatsApp
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

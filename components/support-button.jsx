'use client'

import { Phone, MessageCircle, Mail, HelpCircle } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export default function SupportButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-6 right-6 z-50 bg-primary-custom hover:bg-primary-custom/90 text-white p-4 rounded-full shadow-lg transition-all duration-300"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Support</h4>
            <p className="text-sm text-muted-foreground">
              Contact us for help
            </p>
          </div>
          <div className="grid gap-2">
            <a href="tel:+1234567890" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
            <a href="mailto:support@example.com" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <Mail className="w-5 h-5" />
              <span>Messenger</span>
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
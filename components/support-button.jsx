'use client'

import { Phone, MessageCircle, Mail, Headset } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

import { useSiteSettings } from "@/components/site-settings-provider"

export default function SupportButton() {
  const { settings } = useSiteSettings()
  
  const phone = settings?.contactInfo?.phone || "09658-405962"
  const whatsapp = settings?.socialLinks?.whatsapp || ""
  const messenger = settings?.socialLinks?.messenger || ""
  const email = settings?.contactInfo?.email || "info.equalfashionltd@gmail.com"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-20 right-20 z-50 bg-primary-custom hover:bg-primary-custom/90 text-white px-4 py-6 rounded-full shadow-lg transition-all duration-300"
        >
          <Headset className="w-10 h-10" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Support</h4>
            <p className="text-sm text-muted-foreground">
              Contact us for help
            </p>
          </div>
          <div className="grid gap-2">
            <a href={`tel:${phone}`} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              <Phone className="w-5 h-5 text-primary-custom" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Call Us</span>
                <span className="text-sm font-medium">{phone}</span>
              </div>
            </a>
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">WhatsApp</span>
                  <span className="text-sm font-medium">{whatsapp}</span>
                </div>
              </a>
            )}
            {messenger ? (
              <a href={messenger} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Messenger</span>
                  <span className="text-sm font-medium">Chat with us</span>
                </div>
              </a>
            ) : (
              <a href={`mailto:${email}`} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <Mail className="w-5 h-5 text-red-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <span className="text-sm font-medium truncate max-w-[140px]">{email}</span>
                </div>
              </a>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
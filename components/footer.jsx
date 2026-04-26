"use client"
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, MessageCircle, Music2 } from "lucide-react"
import Link from "next/link"
import { useSiteSettings } from "@/components/site-settings-provider"

export function Footer() {
  const { settings } = useSiteSettings()

  const primaryColor = settings?.primaryColor || "#3B82F6"
  const secondaryColor = settings?.secondaryColor || "#1E3A8A"

  const footerStyle = {
    backgroundColor: secondaryColor,
    color: "#FFFFFF",
  }

  const linkStyle = {
    color: "#FFFFFF",
    transition: "color 0.3s ease",
  }


  return (
    <footer style={footerStyle} className="pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 text-sm md:text-base">
          {/* Social Links & About */}
          <div className="col-span-2 lg:col-span-1 order-1 lg:order-1 flex flex-col items-center lg:items-start">
            <h3 className="text-2xl font-bold mb-8">Social link</h3>
            <div className="flex space-x-4 mb-10">
              <a href="https://facebook.com/equalfashion.bd" target="_blank" style={linkStyle} className="w-12 h-12 flex items-center justify-center border-2 border-white/50 rounded-lg hover:bg-white transition-all duration-300 shadow-sm group">
                <Facebook className="w-6 h-6 text-white group-hover:text-blue-600" />
              </a>
              <a href="https://instagram.com/equal_fashion_com" target="_blank" style={linkStyle} className="w-12 h-12 flex items-center justify-center border-2 border-white/50 rounded-lg hover:bg-white transition-all duration-300 shadow-sm group">
                <Instagram className="w-6 h-6 text-white group-hover:text-pink-600" />
              </a>
              <a href="https://tiktok.com/@equalfashion" target="_blank" style={linkStyle} className="w-12 h-12 flex items-center justify-center border-2 border-white/50 rounded-lg hover:bg-white transition-all duration-300 shadow-sm group">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-white group-hover:text-black"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@equal_fashion" target="_blank" style={linkStyle} className="w-12 h-12 flex items-center justify-center border-2 border-white/50 rounded-lg hover:bg-white transition-all duration-300 shadow-sm group">
                <Youtube className="w-6 h-6 text-white group-hover:text-red-600" />
              </a>
            </div>
            
            <div className="hidden lg:block text-left">
              <h3 className="text-xl font-bold mb-4">About Equal Fashion</h3>
              <p className="mb-4 text-gray-200">
                Welcome to Equal Fashion – Style for Everyone. A trusted online platform delivering trendy fashion, quality products, and reliable retail & wholesale services all over Bangladesh.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 lg:col-span-1 order-3 lg:order-2 flex flex-col items-start px-4 lg:px-0">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" style={linkStyle} className="hover:text-primary-custom">Home</Link>
              </li>
              <li>
                <Link href="/products" style={linkStyle} className="hover:text-primary-custom">All Products</Link>
              </li>
              <li>
                <Link href="/categories" style={linkStyle} className="hover:text-primary-custom">Categories</Link>
              </li>
              <li>
                <Link href="/our-team" style={linkStyle} className="hover:text-primary-custom">Our Team</Link>
              </li>
              <li>
                <Link href="/faq" style={linkStyle} className="hover:text-primary-custom">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Policy */}
          <div className="col-span-1 lg:col-span-1 order-4 lg:order-3 flex flex-col items-start px-4 lg:px-0">
            <h3 className="text-xl font-bold mb-4">Policy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" style={linkStyle} className="hover:text-primary-custom">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" style={linkStyle} className="hover:text-primary-custom">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/return-policy" style={linkStyle} className="hover:text-primary-custom">Return Policy</Link>
              </li>
              <li>
                <Link href="/about" style={linkStyle} className="hover:text-primary-custom">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-span-2 lg:col-span-1 order-2 lg:order-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="text-2xl font-bold mb-8">Contact Us</h3>
            <ul className="space-y-4 flex flex-col items-center lg:items-start">
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-1 lg:gap-3">
                <MapPin className="w-5 h-5 text-primary-custom shrink-0 lg:mt-1" />
                <span className="text-sm max-w-[280px] lg:max-w-none">H A plaza section-11, block c, avenue-3, lane-12, house-8, mirpur 1216 (মোহাম্মদীয়া মার্কেটের দক্ষিন পার্শ্বে)</span>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-1 lg:gap-3">
                <Phone className="w-5 h-5 text-primary-custom shrink-0" />
                <span>09658-405962</span>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-1 lg:gap-3">
                <MessageCircle className="w-5 h-5 text-primary-custom shrink-0" />
                <span>01410558889</span>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-1 lg:gap-3">
                <Mail className="w-5 h-5 text-primary-custom shrink-0" />
                <span className="text-sm break-all">info.equalfashionltd@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
          <p>
            &copy; {new Date().getFullYear()} Equal Fashion. All Rights Reserved.
          </p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:underline">Terms</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"
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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm md:text-base">
          <div>
            <h3 className="text-xl font-bold mb-4">About Equal Fashion</h3>
            <p className="mb-4 text-gray-200">
              Equal Fashion একটি আধুনিক ও বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম। আমাদের লক্ষ্য সাশ্রয়ী মূল্যে মানসম্মত পণ্য পৌঁছে দেওয়া।
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/equalfashion.bd" target="_blank" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://wa.me/01410558889" target="_blank" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
            </div>
          </div>

          <div>
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

          <div>
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

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary-custom"></i>
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-primary-custom"></i>
                <span>09658-405962</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-primary-custom"></i>
                <span className="text-sm">info.equalfashionltd@gmail.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-clock mt-1 mr-3 text-primary-custom"></i>
                <span>প্রতিদিন সকাল ১০টা - রাত ১০টা</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
          <p>
            &copy; {new Date().getFullYear()} {settings?.siteName || "Equal Fashion"}. All Rights Reserved.
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

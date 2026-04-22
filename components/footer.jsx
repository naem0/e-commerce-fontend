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
              Welcome to Equal Fashion – Style for Everyone. A trusted online platform delivering trendy fashion, quality products, and reliable retail & wholesale services all over Bangladesh.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/equalfashion.bd" target="_blank" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="https://instagram.com/equal_fashion_com" target="_blank" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://tiktok.com/@equalfashion" target="_blank" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-tiktok text-xl"></i>
              </a>
              <a href="https://www.youtube.com/@equal_fashion" target="_blank" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a href="https://m.me/equalfashion.bd" target="_blank" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-facebook-messenger text-xl"></i>
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
                <span className="text-sm">H A plaza section-11, block c, avenue-3, lane-12, house-8, mirpur 1216 (মোহাম্মদীয়া মার্কেটের দক্ষিন পার্শ্বে)</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-primary-custom"></i>
                <span>09658-405962</span>
              </li>
              <li className="flex items-center">
                <i className="fab fa-whatsapp mr-3 text-primary-custom text-lg"></i>
                <span>01410558889</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-primary-custom"></i>
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

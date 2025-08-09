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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About</h3>
            <p className="mb-4">About Description</p>
            <div className="flex space-x-4">
              <a href="#" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" style={linkStyle} className="hover:text-primary-custom">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" style={linkStyle} className="hover:text-primary-custom">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" style={linkStyle} className="hover:text-primary-custom">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" style={linkStyle} className="hover:text-primary-custom">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" style={linkStyle} className="hover:text-primary-custom">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/electronics" style={linkStyle} className="hover:text-primary-custom">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/clothing" style={linkStyle} className="hover:text-primary-custom">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/category/home" style={linkStyle} className="hover:text-primary-custom">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/category/beauty" style={linkStyle} className="hover:text-primary-custom">
                  Beauty
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2"></i>
                <span>123 Street, City, Country</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-2"></i>
                <span>+123 456 7890</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-2"></i>
                <span>info@example.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-clock mt-1 mr-2"></i>
                <span>Working Hours</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-6 border-gray-600" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} {settings?.siteName || "E-Commerce"}. Copyright
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <Link href="/terms" style={linkStyle} className="hover:text-primary-custom">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" style={linkStyle} className="hover:text-primary-custom">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/faq" style={linkStyle} className="hover:text-primary-custom">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { ContactDropdown } from "./contact-dropdown"
import { NotificationDropdown } from "./notification-dropdown"
import { ProfileDropdown } from "./profile-dropdown"
import { MegaMenu } from "./mega-menu"
import { MobileMenu } from "./mobile-menu"
import { useAuth } from "@/components/auth/auth-provider"

const navigationItems = [
  { name: "Hub", href: "/hub" },
  { name: "Identity", href: "/identity" },
  { name: "Communication", href: "/communication" },
  { name: "Contributions", href: "/contributions" },
  { name: "Library", href: "/library" },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <>
      <header className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
        <div className="mx-auto px-4 sm:px-6 py-1">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 text-lg sm:text-xl font-bold">
              <img
                src="/sai-baba-peaceful-face-with-orange-turban.png"
                alt="Sai Baba"
                className="w-9 h-9 rounded-full border-2 border-white/20"
              />
              <span>ABC</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <span className="text-xs xl:text-sm">{item.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Link>
                  <MegaMenu module={item.name} />
                </div>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center space-x-1">
                  <ContactDropdown />
                  <NotificationDropdown />
                  <ProfileDropdown />
                </div>
              ) : null}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}

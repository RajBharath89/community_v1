"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { menuData } from "./mega-menu-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const toggleMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">ABC</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <span className="sr-only">Close menu</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {Object.entries(menuData).map(([menuName, menuInfo]) => (
                <div key={menuName} className="mb-2">
                  <button
                    onClick={() => toggleMenu(menuName)}
                    className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-coral-500">{menuInfo.featured.icon}</div>
                      <div>
                        <div className="font-medium text-gray-900">{menuName}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{menuInfo.description}</div>
                      </div>
                    </div>
                    {expandedMenu === menuName ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {expandedMenu === menuName && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                      {menuInfo.sections.map((section) => (
                        <Link
                          key={section.name}
                          href={section.href}
                          onClick={onClose}
                          className="block p-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-gray-400">{section.icon}</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{section.name}</div>
                              <div className="text-xs text-gray-500 line-clamp-2">{section.description}</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

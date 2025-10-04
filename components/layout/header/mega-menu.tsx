"use client"

import { type MegaMenuProps, menuData } from "./mega-menu-data"
import { useEffect, useRef, useState } from "react"

export function MegaMenu({ module }: MegaMenuProps) {
  const data = menuData[module as keyof typeof menuData]
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState<"center" | "left" | "right">("center")

  useEffect(() => {
    const checkPosition = () => {
      if (!menuRef.current) return

      const menuElement = menuRef.current
      const parentElement = menuElement.parentElement
      if (!parentElement) return

      const parentRect = parentElement.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const menuWidth = 750 // Match the actual CSS width

      // Calculate available space on both sides
      const spaceOnRight = viewportWidth - parentRect.right
      const spaceOnLeft = parentRect.left
      const centerPosition = parentRect.left + (parentRect.width / 2) - (menuWidth / 2)

      // Check if center positioning is possible without going off-screen
      if (centerPosition >= 0 && centerPosition + menuWidth <= viewportWidth) {
        setMenuPosition("center")
      } else if (spaceOnRight >= menuWidth) {
        // If center not possible, try right alignment
        setMenuPosition("right")
      } else if (spaceOnLeft >= menuWidth) {
        // If right not possible, try left alignment
        setMenuPosition("left")
      } else {
        // Fallback to center with viewport constraints
        setMenuPosition("center")
      }
    }

    // Check position on mount and resize
    checkPosition()
    window.addEventListener("resize", checkPosition)

    return () => {
      window.removeEventListener("resize", checkPosition)
    }
  }, [])

  if (!data) return null

  // Determine final positioning class and styles
  const getPositionStyles = () => {
    switch (menuPosition) {
      case "center":
        return {
          className: "left-1/2 origin-top-center",
          style: {
            transform: "translateX(-50%)",
            maxWidth: "90vw",
          }
        }
      case "left":
        return {
          className: "left-0 origin-top-left",
          style: {
            maxWidth: "90vw",
          }
        }
      case "right":
        return {
          className: "right-0 origin-top-right",
          style: {
            maxWidth: "90vw",
          }
        }
      default:
        return {
          className: "left-1/2 origin-top-center",
          style: {
            transform: "translateX(-50%)",
            maxWidth: "90vw",
          }
        }
    }
  }

  const positionStyles = getPositionStyles()

  return (
    <div
      ref={menuRef}
      className={`absolute top-full mt-2 bg-white text-gray-900 shadow-2xl border-t-4 border-red-500 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-50 translate-y-2 group-hover:translate-y-0 rounded-b-xl min-w-max hidden lg:block ${positionStyles.className}`}
      style={positionStyles.style}
    >
      <div className="px-6 py-6 w-full max-w-[750px]">
        
        <div className="grid grid-cols-12 gap-6">
          {/* Featured Section - Made slightly wider for image */}
          <div className="col-span-4">
            <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white p-6 rounded-xl h-full shadow-lg relative overflow-hidden">
              {data.featured.image && (
                <div className="absolute inset-0 opacity-95">
                  <img
                    src={data.featured.image || "/placeholder.svg"}
                    alt="Sai Baba"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-red-800/30"></div>
              
            </div>
          </div>

          {/* Navigation Sections - Adjusted width to accommodate wider image */}
          <div className="col-span-8">
            <div className="grid grid-cols-2 gap-4">
              {data.sections.map((section, index) => (
                <a
                  key={index}
                  href={section.href}
                  className="flex items-start space-x-3 p-4 rounded-xl 
  hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 
  transition-all duration-300 ease-out group/item 
  hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-[1.02] 
  border border-gray-100 hover:border-red-200/50 
  ]"
  // shadow-[0_4px_12px_rgba(0,0,0,0.08)
                >
                  <div className="text-red-500 mt-1 group-hover/item:text-red-600 transition-all duration-300 group-hover/item:scale-110 group-hover/item:drop-shadow-sm flex-shrink-0">
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 group-hover/item:text-red-700 transition-all duration-300 group-hover/item:translate-x-1">
                      {section.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed group-hover/item:text-gray-700 transition-colors duration-300">
                      {section.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
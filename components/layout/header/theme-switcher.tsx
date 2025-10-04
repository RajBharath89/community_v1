"use client"

import { useState } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"

const themes = {
  gradients: [
    { name: "Coral Sunset", value: "from-red-500 to-red-600", preview: "bg-gradient-to-r from-red-500 to-red-600" },
    { name: "Ocean Blue", value: "from-blue-500 to-blue-600", preview: "bg-gradient-to-r from-blue-500 to-blue-600" },
    {
      name: "Forest Green",
      value: "from-green-500 to-green-600",
      preview: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      name: "Royal Purple",
      value: "from-purple-500 to-purple-600",
      preview: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
  ],
  solids: [
    { name: "Classic Red", value: "bg-red-600", preview: "bg-red-600" },
    { name: "Deep Blue", value: "bg-blue-600", preview: "bg-blue-600" },
    { name: "Emerald", value: "bg-emerald-600", preview: "bg-emerald-600" },
    { name: "Amber", value: "bg-amber-600", preview: "bg-amber-600" },
  ],
}

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("from-red-500 to-red-600")

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-white/10">
          <Palette className="h-5 w-5" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-56 p-0">
        <div className="p-4 pb-2">
          <span className="font-semibold">Theme Colors</span>
        </div>
        <Separator />

        <div className="p-2">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-2">Gradients</div>
          {themes.gradients.map((theme) => (
            <div
              key={theme.name}
              className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm"
              onClick={() => setCurrentTheme(theme.value)}
            >
              <div className={`w-4 h-4 rounded-full ${theme.preview}`}></div>
              <span className="text-sm">{theme.name}</span>
              {currentTheme === theme.value && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>}
            </div>
          ))}
        </div>

        <Separator />
        <div className="p-2">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-2">Solid Colors</div>
          {themes.solids.map((theme) => (
            <div
              key={theme.name}
              className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm"
              onClick={() => setCurrentTheme(theme.value)}
            >
              <div className={`w-4 h-4 rounded-full ${theme.preview}`}></div>
              <span className="text-sm">{theme.name}</span>
              {currentTheme === theme.value && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>}
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

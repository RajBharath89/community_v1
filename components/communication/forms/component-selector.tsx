"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ComponentSelectorProps {
  isOpen: boolean
  onToggle: () => void
}

const COMPONENTS = [
  "Checkbox",
  "Combobox",
  "Date Picker",
  "Datetime Picker",
  "File Input",
  "Input",
  "Input OTP",
  "Location Input",
  "Multi Select",
  "Password",
  "Phone",
]

export function ComponentSelector({ isOpen, onToggle }: ComponentSelectorProps) {
  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className={`fixed top-4 z-50 transition-all duration-300 ${isOpen ? "right-80" : "right-4"}`}
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full bg-background border-l transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "320px" }}
      >
        <div className="p-6 h-full overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Component</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {COMPONENTS.map((component) => (
                <Button
                  key={component}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => {
                    // This would typically trigger adding the component to the form
                    console.log(`Selected: ${component}`)
                  }}
                >
                  {component}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">This form contains</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• File Input</li>
                <li>• Location Input</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-30" onClick={onToggle} />}
    </>
  )
}

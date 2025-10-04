"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function TablePagination() {
  // This is a simplified pagination component
  // In a real application, you would integrate this with your data store
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
      <div className="flex items-center text-sm text-gray-700">
        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
        <span className="font-medium">25</span> results
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          <ChevronRight className="h-4 w-4" />
          Next
        </Button>
      </div>
    </div>
  )
}

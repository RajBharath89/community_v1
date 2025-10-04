"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useVolunteerStore } from "@/stores/volunteer-store"

export function VolunteerTablePagination() {
  const {
    currentPage,
    itemsPerPage,
    getTotalItems,
    setCurrentPage,
    setItemsPerPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  } = useVolunteerStore()

  const totalItems = getTotalItems()

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  if (totalItems === 0) {
    return null
  }

  return (
    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
        <span className="text-sm text-gray-700">
          Showing {startItem} to {endItem} of {totalItems} applications
        </span>
        <span className="hidden sm:inline text-sm text-gray-500">•</span>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show:</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-1">
          <Button 
            variant="outline" 
            size="icon" 
            disabled={currentPage === 1}
            onClick={goToFirstPage}
            className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
          >
            <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
            className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          
          {/* Page numbers */}
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page)}
              className={`h-8 px-3 sm:h-9 ${
                page === currentPage
                  ? "bg-red-500 text-white hover:bg-red-600 hover:text-white"
                  : ""
              }`}
            >
              {page}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            size="icon" 
            disabled={currentPage === totalPages}
            onClick={goToNextPage}
            className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            disabled={currentPage === totalPages}
            onClick={goToLastPage}
            className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
          >
            <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

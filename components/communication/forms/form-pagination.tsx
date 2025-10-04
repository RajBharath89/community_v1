"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useFormStore } from "@/stores/form-store"

export function FormPagination() {
  const {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    getPaginationInfo
  } = useFormStore()

  const { totalItems, totalPages, startIndex, endIndex } = getPaginationInfo()

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
  }

  return (
    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
        <span className="text-sm text-gray-700">
          Showing {startIndex} to {endIndex} of {totalItems} forms
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
          <Button 
            variant="outline" 
            size="sm"  
            className="bg-red-500 text-white hover:bg-red-600 hover:text-white h-8 px-3 sm:h-9"
          >
            {currentPage}
          </Button>
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

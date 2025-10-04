"use client"

import { useState, useRef, useEffect } from "react"
import { LibraryItem } from "@/stores/library-store"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  BookOpen, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Share2,
  Settings,
  Search,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface DocumentReaderProps {
  isOpen: boolean
  onClose: () => void
  item: LibraryItem | null
}

export function DocumentReader({ isOpen, onClose, item }: DocumentReaderProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)
  const [pdfLoadError, setPdfLoadError] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(true)
  const [pdfViewerMethod, setPdfViewerMethod] = useState<'google' | 'direct' | 'mozilla'>('google')
  
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const readerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && item) {
      // Reset reader state when opening
      setCurrentPage(1)
      setZoom(100)
      setRotation(0)
      setIsBookmarked(false)
      setSearchTerm("")
      setSearchResults([])
      setCurrentSearchIndex(0)
      setShowSearch(false)
      setPdfLoadError(false)
      setPdfLoading(true)
      setPdfViewerMethod('google')
      
      // Simulate loading pages for demo
      setTotalPages(item.metadata?.pages || 10)
      
      // Set a timeout to detect PDF loading issues
      const timeout = setTimeout(() => {
        setPdfLoading(false)
        if (iframeRef.current && !iframeRef.current.contentDocument) {
          setPdfLoadError(true)
        }
      }, 5000)
      
      return () => clearTimeout(timeout)
    }
  }, [isOpen, item])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.code) {
        case "ArrowLeft":
          e.preventDefault()
          goToPreviousPage()
          break
        case "ArrowRight":
          e.preventDefault()
          goToNextPage()
          break
        case "KeyF":
          e.preventDefault()
          toggleFullscreen()
          break
        case "KeyB":
          e.preventDefault()
          toggleBookmark()
          break
        case "KeyS":
          e.preventDefault()
          setShowSearch(!showSearch)
          break
        case "Equal":
        case "NumpadAdd":
          e.preventDefault()
          setZoom(prev => Math.min(200, prev + 10))
          break
        case "Minus":
        case "NumpadSubtract":
          e.preventDefault()
          setZoom(prev => Math.max(50, prev - 10))
          break
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [isOpen, showSearch])

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0])
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && readerRef.current) {
      readerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? "Bookmark removed" : "Bookmark added")
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }
    
    // Simulate search results
    const results = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => 
      Math.floor(Math.random() * totalPages) + 1
    ).sort((a, b) => a - b)
    
    setSearchResults(results)
    setCurrentSearchIndex(0)
    
    if (results.length > 0) {
      setCurrentPage(results[0])
    }
  }

  const goToNextSearch = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentSearchIndex + 1) % searchResults.length
      setCurrentSearchIndex(nextIndex)
      setCurrentPage(searchResults[nextIndex])
    }
  }

  const goToPreviousSearch = () => {
    if (searchResults.length > 0) {
      const prevIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1
      setCurrentSearchIndex(prevIndex)
      setCurrentPage(searchResults[prevIndex])
    }
  }

  const handleDownload = () => {
    if (item?.fileUrl) {
      const link = document.createElement('a')
      link.href = item.fileUrl
      link.download = item.title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Download started!")
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title,
        text: item?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const getPdfViewerUrl = (method: 'google' | 'direct' | 'mozilla') => {
    if (!item?.fileUrl) return ''
    
    switch (method) {
      case 'google':
        return `https://docs.google.com/gview?url=${encodeURIComponent(item.fileUrl)}&embedded=true`
      case 'mozilla':
        return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(item.fileUrl)}`
      case 'direct':
        return `${item.fileUrl}#toolbar=0&navpanes=0&scrollbar=1`
      default:
        return item.fileUrl
    }
  }

  const tryNextViewerMethod = () => {
    if (pdfViewerMethod === 'google') {
      setPdfViewerMethod('mozilla')
    } else if (pdfViewerMethod === 'mozilla') {
      setPdfViewerMethod('direct')
    } else {
      setPdfViewerMethod('google')
    }
    setPdfLoadError(false)
    setPdfLoading(true)
  }

  if (!item) return null

  const isEbook = item.type === "ebook"
  const isDocument = item.type === "document"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl w-full max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            {isEbook ? "📖" : "📄"} {item.title}
          </DialogTitle>
          <DialogDescription>
            {item.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 p-6 pt-4 overflow-hidden">
          <div 
            ref={readerRef}
            className="relative bg-gray-50 rounded-lg overflow-hidden border h-full flex flex-col"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-white border-b">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">Page</span>
                  <Input
                    type="number"
                    value={currentPage}
                    onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                    className="w-16 h-8 text-center"
                    min={1}
                    max={totalPages}
                  />
                  <span className="text-sm">of {totalPages}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {/* Search */}
                {showSearch && (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search in document..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-48 h-8"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button size="sm" onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                    {searchResults.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousSearch}
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <span className="text-xs">
                          {currentSearchIndex + 1} of {searchResults.length}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextSearch}
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleBookmark}
                >
                  {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 p-4 bg-white overflow-auto">
              <div 
                className="mx-auto bg-white shadow-lg transition-transform duration-300 ease-in-out"
                // eslint-disable-next-line react/forbid-dom-props
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'center top'
                }}
              >
                {item.fileUrl && !pdfLoadError ? (
                  <div className="relative">
                    {pdfLoading && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Loading PDF...</p>
                        </div>
                      </div>
                    )}
                    <iframe
                      ref={iframeRef}
                      src={getPdfViewerUrl(pdfViewerMethod)}
                      className="w-full h-[500px] border-0"
                      title={item.title}
                      onLoad={() => {
                        setPdfLoading(false)
                        setPdfLoadError(false)
                      }}
                      onError={() => {
                        setPdfLoading(false)
                        setPdfLoadError(true)
                      }}
                    />
                  </div>
                ) : item.fileUrl && pdfLoadError ? (
                  <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-700">PDF Preview Unavailable</h3>
                      <p className="text-gray-600 mb-2">
                        The PDF preview couldn't be loaded using {pdfViewerMethod} viewer.
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        This may be due to browser restrictions or CORS policies.
                      </p>
                      <div className="space-y-2">
                        <Button
                          onClick={() => window.open(item.fileUrl, '_blank')}
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Open PDF in New Tab
                        </Button>
                        <Button
                          variant="outline"
                          onClick={tryNextViewerMethod}
                          className="w-full"
                        >
                          Try {pdfViewerMethod === 'google' ? 'Mozilla' : pdfViewerMethod === 'mozilla' ? 'Direct' : 'Google'} Viewer
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPdfLoadError(false)
                            setPdfLoading(true)
                          }}
                          className="w-full"
                        >
                          Retry Current Method
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                        {isEbook ? <BookOpen className="w-8 h-8 text-gray-400" /> : <FileText className="w-8 h-8 text-gray-400" />}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Page {currentPage}</h3>
                      <p className="text-gray-600 mb-4">
                        {isEbook ? "Ebook content would be displayed here" : "Document content would be displayed here"}
                      </p>
                      <div className="text-sm text-gray-500">
                        <p>Author: {item.author || "Unknown"}</p>
                        <p>Language: {item.language}</p>
                        {item.metadata?.pages && <p>Total Pages: {item.metadata.pages}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between p-4 bg-white border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ZoomOut 
                    className="h-4 w-4 cursor-pointer" 
                    onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                  />
                  <span className="text-sm w-12 text-center">{zoom}%</span>
                  <ZoomIn 
                    className="h-4 w-4 cursor-pointer" 
                    onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                  />
                </div>
                
                <div className="w-32">
                  <Slider
                    value={[zoom]}
                    min={50}
                    max={200}
                    step={10}
                    onValueChange={handleZoomChange}
                    className="w-full"
                  />
                </div>
                
                {item.fileUrl && (
                  <Badge variant="outline" className="text-xs">
                    {pdfViewerMethod} viewer
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Badge variant="secondary" className="text-xs">
                  {isEbook ? "Ebook" : "Document"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Document Info */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Author:</span>
              <span className="ml-2 font-medium">{item.author || "Unknown"}</span>
            </div>
            <div>
              <span className="text-gray-600">Language:</span>
              <span className="ml-2 font-medium">{item.language}</span>
            </div>
            <div>
              <span className="text-gray-600">Pages:</span>
              <span className="ml-2 font-medium">{item.metadata?.pages || totalPages}</span>
            </div>
            <div>
              <span className="text-gray-600">Format:</span>
              <span className="ml-2 font-medium">{item.metadata?.format || "PDF"}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

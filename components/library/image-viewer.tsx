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
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Share2,
  Maximize,
  Minimize,
  Move,
  Eye,
  EyeOff,
  Info,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ImageViewerProps {
  isOpen: boolean
  onClose: () => void
  item: LibraryItem | null
}

export function ImageViewer({ isOpen, onClose, item }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  const imageRef = useRef<HTMLImageElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && item) {
      // Reset viewer state when opening
      setZoom(100)
      setRotation(0)
      setShowInfo(false)
      setIsDragging(false)
      setPosition({ x: 0, y: 0 })
      setIsLoading(true)
      setImageError(false)
    }
  }, [isOpen, item])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.code) {
        case "KeyF":
          e.preventDefault()
          toggleFullscreen()
          break
        case "KeyI":
          e.preventDefault()
          setShowInfo(!showInfo)
          break
        case "Equal":
        case "NumpadAdd":
          e.preventDefault()
          setZoom(prev => Math.min(500, prev + 25))
          break
        case "Minus":
        case "NumpadSubtract":
          e.preventDefault()
          setZoom(prev => Math.max(25, prev - 25))
          break
        case "KeyR":
          e.preventDefault()
          setRotation(prev => (prev + 90) % 360)
          break
        case "Digit0":
          e.preventDefault()
          setZoom(100)
          setPosition({ x: 0, y: 0 })
          break
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [isOpen, showInfo])

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0])
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && viewerRef.current) {
      viewerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 100) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 100) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -25 : 25
    setZoom(prev => Math.max(25, Math.min(500, prev + delta)))
  }

  const resetView = () => {
    setZoom(100)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
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

  const handleImageLoad = () => {
    setIsLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setImageError(true)
  }

  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl w-full max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            🖼️ {item.title}
          </DialogTitle>
          <DialogDescription>
            {item.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 p-6 pt-4 overflow-hidden">
          <div 
            ref={viewerRef}
            className="relative bg-black rounded-lg overflow-hidden border h-full"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-white border-b">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(prev => Math.max(25, prev - 25))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm w-12 text-center">{zoom}%</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(prev => Math.min(500, prev + 25))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>

                <div className="w-32">
                  <Slider
                    value={[zoom]}
                    min={25}
                    max={500}
                    step={25}
                    onValueChange={handleZoomChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetView}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <Info className="h-4 w-4" />
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

            {/* Image Container */}
            <div 
              className="relative flex-1 bg-gray-100 overflow-hidden cursor-move h-[600px]"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                      <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Loading image...</p>
                  </div>
                </div>
              )}

              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <EyeOff className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Image not available</h3>
                    <p className="text-gray-600">The image could not be loaded</p>
                  </div>
                </div>
              ) : (
                <img
                  ref={imageRef}
                  src={item.thumbnail || item.fileUrl}
                  alt={item.title}
                  className={`absolute top-1/2 left-1/2 max-w-none transition-transform duration-200 ${
                    zoom > 100 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
                  }`}
                  // eslint-disable-next-line react/forbid-dom-props
                  style={{
                    transform: `translate(-50%, -50%) scale(${zoom / 100}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}

              {/* Zoom indicator */}
              {zoom > 100 && (
                <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {zoom}% - Drag to pan
                </div>
              )}
            </div>

            {/* Info Panel */}
            {showInfo && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-sm">
                <h4 className="font-semibold mb-2">Image Information</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Title:</span> {item.title}</div>
                  <div><span className="font-medium">Category:</span> {item.category}</div>
                  <div><span className="font-medium">File Size:</span> {item.fileSize || "Unknown"}</div>
                  <div><span className="font-medium">Language:</span> {item.language}</div>
                  {item.metadata?.resolution && (
                    <div><span className="font-medium">Resolution:</span> {item.metadata.resolution}</div>
                  )}
                  {item.metadata?.format && (
                    <div><span className="font-medium">Format:</span> {item.metadata.format}</div>
                  )}
                  {item.metadata?.quality && (
                    <div><span className="font-medium">Quality:</span> {item.metadata.quality}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Image Info */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 font-medium">{item.category}</span>
            </div>
            <div>
              <span className="text-gray-600">File Size:</span>
              <span className="ml-2 font-medium">{item.fileSize || "Unknown"}</span>
            </div>
            <div>
              <span className="text-gray-600">Resolution:</span>
              <span className="ml-2 font-medium">{item.metadata?.resolution || "Unknown"}</span>
            </div>
            <div>
              <span className="text-gray-600">Format:</span>
              <span className="ml-2 font-medium">{item.metadata?.format || "Unknown"}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

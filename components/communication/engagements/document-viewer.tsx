"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Eye, 
  AlertTriangle,
  RefreshCw,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  X
} from "lucide-react"

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  documentFile: {
    id: string
    name: string
    type: string
    size: number
    url: string
  }
}

interface ViewerState {
  currentViewer: 'embed' | 'mozilla' | 'download' | 'error'
  isLoading: boolean
  error: string | null
  zoom: number
  rotation: number
  isFullscreen: boolean
}

export function DocumentViewer({ isOpen, onClose, documentFile }: DocumentViewerProps) {
  const [viewerState, setViewerState] = useState<ViewerState>({
    currentViewer: 'embed',
    isLoading: true,
    error: null,
    zoom: 100,
    rotation: 0,
    isFullscreen: false
  })

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerContainerRef = useRef<HTMLDivElement>(null)

  // Reset state when document changes
  useEffect(() => {
    if (isOpen) {
      setViewerState({
        currentViewer: 'embed',
        isLoading: true,
        error: null,
        zoom: 100,
        rotation: 0,
        isFullscreen: false
      })
    }
  }, [isOpen, documentFile.id])

  // Update CSS custom properties when zoom or rotation changes
  useEffect(() => {
    if (viewerContainerRef.current) {
      viewerContainerRef.current.style.setProperty('--zoom', (viewerState.zoom / 100).toString())
      viewerContainerRef.current.style.setProperty('--rotation', `${viewerState.rotation}deg`)
    }
  }, [viewerState.zoom, viewerState.rotation])

  const getFileType = (type: string) => {
    if (type.includes('pdf')) return 'PDF'
    if (type.includes('word') || type.includes('document')) return 'Word'
    if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel'
    if (type.includes('powerpoint') || type.includes('presentation')) return 'PowerPoint'
    if (type.includes('image')) return 'Image'
    return 'Document'
  }

  const getDocumentViewerUrl = (url: string, type: string) => {
    // For Office documents, use Microsoft Office Online viewer
    if (type.includes('word') || type.includes('document')) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    }
    if (type.includes('excel') || type.includes('spreadsheet')) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    }
    if (type.includes('powerpoint') || type.includes('presentation')) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
    }
    // For PDFs, use the original URL
    return url
  }

  const isOfficeDocument = (type: string) => {
    return type.includes('word') || type.includes('document') || 
           type.includes('excel') || type.includes('spreadsheet') ||
           type.includes('powerpoint') || type.includes('presentation')
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
    if (type.includes('word') || type.includes('document')) return <FileText className="h-5 w-5 text-blue-500" />
    if (type.includes('excel') || type.includes('spreadsheet')) return <FileText className="h-5 w-5 text-green-500" />
    if (type.includes('powerpoint') || type.includes('presentation')) return <FileText className="h-5 w-5 text-orange-500" />
    if (type.includes('image')) return <FileText className="h-5 w-5 text-purple-500" />
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleViewerError = () => {
    setViewerState(prev => ({
      ...prev,
      isLoading: false,
      error: 'Failed to load document preview',
      currentViewer: 'mozilla'
    }))
  }

  const switchToMozillaReader = () => {
    setViewerState(prev => ({
      ...prev,
      currentViewer: 'mozilla',
      isLoading: false,
      error: null
    }))
  }

  const switchToDownload = () => {
    setViewerState(prev => ({
      ...prev,
      currentViewer: 'download',
      isLoading: false,
      error: null
    }))
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = documentFile.url
    link.download = documentFile.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenInNewTab = () => {
    window.open(documentFile.url, '_blank')
  }

  const toggleFullscreen = () => {
    setViewerState(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen
    }))
  }

  const adjustZoom = (direction: 'in' | 'out') => {
    setViewerState(prev => ({
      ...prev,
      zoom: direction === 'in' 
        ? Math.min(prev.zoom + 25, 300)
        : Math.max(prev.zoom - 25, 50)
    }))
  }

  const rotateDocument = () => {
    setViewerState(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }))
  }

  const resetView = () => {
    setViewerState(prev => ({
      ...prev,
      zoom: 100,
      rotation: 0
    }))
  }

  const renderViewer = () => {
    const { currentViewer, zoom, rotation } = viewerState

    switch (currentViewer) {
      case 'embed':
        return (
          <div 
            ref={viewerContainerRef}
            className="relative w-full h-full"
          >
            <iframe
              ref={iframeRef}
              src={getDocumentViewerUrl(documentFile.url, documentFile.type)}
              className="w-full h-full border-0 document-iframe"
              onLoad={() => setViewerState(prev => ({ ...prev, isLoading: false }))}
              onError={handleViewerError}
              title={`Preview of ${documentFile.name}`}
            />
            {viewerState.isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-600">Loading document...</span>
                </div>
              </div>
            )}
          </div>
        )

      case 'mozilla':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center space-y-4 p-8">
              <div className="flex justify-center">
                {getFileIcon(documentFile.type)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isOfficeDocument(documentFile.type) ? 'Open with Office Online' : 'Open with Mozilla Reader'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isOfficeDocument(documentFile.type) 
                    ? 'For the best Office document viewing experience, we recommend using Microsoft Office Online.'
                    : 'For the best document viewing experience, we recommend using Mozilla Reader.'
                  }
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={handleOpenInNewTab}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {isOfficeDocument(documentFile.type) ? 'Open in Office Online' : 'Open in Mozilla Reader'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'download':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center space-y-4 p-8">
              <div className="flex justify-center">
                {getFileIcon(documentFile.type)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Download Document
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Download the document to view it with your preferred application.
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download {documentFile.name}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleOpenInNewTab}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-red-50">
            <div className="text-center space-y-4 p-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Preview Error
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Unable to preview this document. Try alternative viewing options.
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={switchToMozillaReader}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Try Mozilla Reader
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`max-w-6xl h-[90vh] p-0 ${viewerState.isFullscreen ? 'max-w-none w-screen h-screen' : ''}`}
      >
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(documentFile.type)}
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {documentFile.name}
                </DialogTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {getFileType(documentFile.type)}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(documentFile.size)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Viewer Controls */}
              {viewerState.currentViewer === 'embed' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustZoom('out')}
                    disabled={viewerState.zoom <= 50}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                    {viewerState.zoom}%
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustZoom('in')}
                    disabled={viewerState.zoom >= 300}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={rotateDocument}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetView}
                  >
                    Reset
                  </Button>
                </>
              )}
              
              {/* Viewer Options */}
              <div className="flex items-center space-x-1 border-l pl-2">
                <Button
                  size="sm"
                  variant={viewerState.currentViewer === 'embed' ? 'default' : 'outline'}
                  onClick={() => setViewerState(prev => ({ ...prev, currentViewer: 'embed' }))}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewerState.currentViewer === 'mozilla' ? 'default' : 'outline'}
                  onClick={switchToMozillaReader}
                >
                  {isOfficeDocument(documentFile.type) ? 'Office' : 'Mozilla'}
                </Button>
                <Button
                  size="sm"
                  variant={viewerState.currentViewer === 'download' ? 'default' : 'outline'}
                  onClick={switchToDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={toggleFullscreen}
              >
                {viewerState.isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div 
          ref={containerRef}
          className="flex-1 overflow-hidden"
        >
          {renderViewer()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

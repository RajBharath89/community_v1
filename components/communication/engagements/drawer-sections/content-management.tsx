"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { 
  FileText, 
  Upload, 
  X, 
  Paperclip, 
  Eye, 
  EyeOff,
  File,
  Image,
  FileVideo,
  FileAudio,
  Download,
  ExternalLink
} from "lucide-react"
import { DocumentViewer } from "../document-viewer"

interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

interface Form {
  id: string
  name: string
  description: string
  fields: number
}

interface ContentManagementProps {
  formData: any
  setFormData: (data: any) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

const availableForms: Form[] = [
  { id: "1", name: "Feedback Form", description: "Collect user feedback", fields: 5 },
  { id: "2", name: "Registration Form", description: "Event registration", fields: 8 },
  { id: "3", name: "Survey Form", description: "User satisfaction survey", fields: 12 },
  { id: "4", name: "Contact Form", description: "General contact form", fields: 4 },
]

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="h-4 w-4 text-red-500" />
  if (type.startsWith('video/')) return <FileVideo className="h-4 w-4 text-purple-500" />
  if (type.startsWith('audio/')) return <FileAudio className="h-4 w-4 text-green-500" />
  return <File className="h-4 w-4 text-gray-500" />
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function ContentManagement({ 
  formData, 
  setFormData, 
  isEditing, 
  validationErrors 
}: ContentManagementProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState("")
  const [documentViewer, setDocumentViewer] = useState<{
    isOpen: boolean
    document: Attachment | null
  }>({
    isOpen: false,
    document: null
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !isEditing) return

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }))

    setFormData((prev: any) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments],
    }))
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    if (!isEditing) return

    setFormData((prev: any) => ({
      ...prev,
      attachments: prev.attachments?.filter((a: Attachment) => a.id !== attachmentId) || [],
    }))
  }

  const handleFormToggle = (formId: string) => {
    if (!isEditing) return

    setFormData((prev: any) => {
      const isSelected = prev.attachedForms?.includes(formId)
      return {
        ...prev,
        attachedForms: isSelected
          ? prev.attachedForms?.filter((id: string) => id !== formId) || []
          : [...(prev.attachedForms || []), formId],
      }
    })
  }

  const handlePreview = () => {
    setPreviewContent(formData.content || "")
    setShowPreview(true)
  }

  const handleViewDocument = (attachment: Attachment) => {
    setDocumentViewer({
      isOpen: true,
      document: attachment
    })
  }

  const handleCloseDocumentViewer = () => {
    setDocumentViewer({
      isOpen: false,
      document: null
    })
  }

  const handleDownloadDocument = (attachment: Attachment) => {
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenInNewTab = (attachment: Attachment) => {
    window.open(attachment.url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-500" />
            Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-sm font-medium">
                Message Content *
              </Label>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  Preview
                </Button>
              )}
            </div>
            {isEditing ? (
              <>
                <Textarea
                  id="content"
                  value={formData.content || ""}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter your engagement message..."
                  rows={6}
                  className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                />
                {validationErrors.content && <p className="text-sm text-red-600">{validationErrors.content}</p>}
              </>
            ) : (
              <div className="p-3 bg-gray-50 rounded border min-h-[120px]">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{formData.content || "No content"}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Attachments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            Attach Forms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 mb-4">Attach forms to collect user responses</p>
          {isEditing ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableForms.map((form) => (
                <div key={form.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={`form-${form.id}`}
                    checked={formData.attachedForms?.includes(form.id) || false}
                    onCheckedChange={() => handleFormToggle(form.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <Label htmlFor={`form-${form.id}`} className="font-medium cursor-pointer">
                        {form.name}
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {form.description} • {form.fields} fields
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2">
              {formData.attachedForms && formData.attachedForms.length > 0 ? (
                <div className="space-y-2">
                  {formData.attachedForms.map((formId: string) => {
                    const form = availableForms.find((f) => f.id === formId)
                    return form ? (
                      <div key={formId} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                        <FileText className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{form.name}</span>
                        <span className="text-xs text-gray-500">• {form.fields} fields</span>
                      </div>
                    ) : null
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No forms attached</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Attachments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-purple-500" />
            Attachments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,application/pdf,.doc,.docx,video/*,audio/*"
                  aria-label="Upload files"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>

              {formData.attachments && formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((attachment: Attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2 flex-1">
                        {getFileIcon(attachment.type)}
                        <span className="text-sm">{attachment.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDocument(attachment)}
                          className="hover:bg-red-50 hover:text-red-600"
                          title="Preview document"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadDocument(attachment)}
                          className="hover:bg-green-50 hover:text-green-600"
                          title="Download document"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenInNewTab(attachment)}
                          className="hover:bg-purple-50 hover:text-purple-600"
                          title="Open in new tab"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                          title="Remove attachment"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-2">
              {formData.attachments && formData.attachments.length > 0 ? (
                <div className="space-y-2">
                  {formData.attachments.map((attachment: Attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2 flex-1">
                        {getFileIcon(attachment.type)}
                        <span className="text-sm">{attachment.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDocument(attachment)}
                          className="hover:bg-red-50 hover:text-red-600"
                          title="Preview document"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadDocument(attachment)}
                          className="hover:bg-green-50 hover:text-green-600"
                          title="Download document"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenInNewTab(attachment)}
                          className="hover:bg-purple-50 hover:text-purple-600"
                          title="Open in new tab"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No attachments</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-red-500" />
              Content Preview
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">{formData.title || "Preview Title"}</h3>
                <p className="text-sm text-gray-600 mb-4">{formData.subject || "Preview Subject"}</p>
                <div className="whitespace-pre-wrap text-sm text-gray-900">
                  {previewContent || "No content to preview"}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer */}
      {documentViewer.document && (
        <DocumentViewer
          isOpen={documentViewer.isOpen}
          onClose={handleCloseDocumentViewer}
          documentFile={documentViewer.document}
        />
      )}
    </div>
  )
}

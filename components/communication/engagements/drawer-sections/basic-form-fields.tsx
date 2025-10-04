"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FileText, Bell, AlertTriangle, Calendar, Users, Upload, X, Image, Video, File, FileText as FileTextIcon, FileSpreadsheet, Presentation, FileArchive, Link, Plus, ExternalLink } from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"
import { useState, useRef } from "react"

const priorities = [
  { value: "Urgent", label: "Urgent", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200", dotColor: "bg-red-600" },
  { value: "High", label: "High", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200", dotColor: "bg-orange-600" },
  { value: "Normal", label: "Normal", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200", dotColor: "bg-blue-600" },
  { value: "Low", label: "Low", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", dotColor: "bg-green-600" },
]

const messageTypes = [
  { value: "Announcement", label: "Announcement", icon: Bell },
  { value: "Event", label: "Event", icon: Calendar },
  { value: "Meeting", label: "Meeting", icon: Users },
]

interface BasicFormFieldsProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

export function BasicFormFields({ formData, setFormData, isEditing, validationErrors }: BasicFormFieldsProps) {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image className="h-8 w-8 text-red-500" />
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />
      case 'pdf':
        return <FileTextIcon className="h-8 w-8 text-red-500" />
      case 'excel':
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      case 'powerpoint':
        return <Presentation className="h-8 w-8 text-orange-500" />
      case 'word':
        return <FileTextIcon className="h-8 w-8 text-red-700" />
      case 'zip':
        return <FileArchive className="h-8 w-8 text-gray-500" />
      default:
        return <File className="h-8 w-8 text-gray-400" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {/* <FileText className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-medium">Basic Information</h3> */}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Title *
          </Label>
          {isEditing ? (
            <>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter engagement title"
                className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
              />
              {validationErrors.title && <p className="text-sm text-red-600">{validationErrors.title}</p>}
            </>
          ) : (
            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">{formData.title || "No title"}</p>
          )}
        </div>



        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Priority *</Label>
            {isEditing ? (
              <>
                <Select
                  value={formData.priority || ""}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                >
                  <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${priority.dotColor}`} />
                          <span>{priority.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.priority && <p className="text-sm text-red-600">{validationErrors.priority}</p>}
              </>
            ) : (
              <div className="mt-2">
                {formData.priority && (
                  <Badge
                    variant="outline"
                    className={`${priorities.find((p) => p.value === formData.priority)?.color} ${
                      priorities.find((p) => p.value === formData.priority)?.borderColor
                    }`}
                  >
                    {formData.priority}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Message Type *</Label>
            {isEditing ? (
              <>
                <Select
                  value={formData.messageType || ""}
                  onValueChange={(value) => setFormData({ ...formData, messageType: value as any })}
                >
                  <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {validationErrors.messageType && <p className="text-sm text-red-600">{validationErrors.messageType}</p>}
              </>
            ) : (
              <div className="mt-2">
                {formData.messageType && <Badge variant="outline">{formData.messageType}</Badge>}
              </div>
            )}
          </div>
        </div>



        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium">
            Message Content *
          </Label>
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
              
              {/* Media Attachments */}
              <MediaAttachmentSection 
                formData={formData} 
                setFormData={setFormData} 
                isEditing={isEditing} 
              />

              {/* Link Attachments */}
              <LinkAttachmentSection 
                formData={formData} 
                setFormData={setFormData} 
                isEditing={isEditing} 
              />

              {/* General Form Section */}
              <GeneralFormSection 
                formData={formData} 
                setFormData={setFormData} 
                isEditing={isEditing} 
              />
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded border min-h-[120px]">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{formData.content || "No content"}</p>
              </div>
              
              {/* Display Media Attachments in View Mode */}
              {formData.mediaAttachments && formData.mediaAttachments.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Media Attachments</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                 {formData.mediaAttachments.map((media) => (
               <div key={media.id} className="relative group">
                 {media.type === "image" ? (
                   <img
                     src={media.url}
                     alt={media.name}
                     className="w-full h-24 object-cover rounded-lg border"
                   />
                 ) : (
                   <div className="w-full h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                     {getFileIcon(media.type)}
                   </div>
                 )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-white text-gray-700 hover:bg-gray-100"
                              onClick={() => window.open(media.url, '_blank')}
                            >
                              <File className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">{media.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display Link Attachments in View Mode */}
              {formData.links && formData.links.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Link Attachments</Label>
                  <div className="space-y-2">
                    {formData.links.map((link) => (
                      <div key={link.id} className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <Link className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-red-600 hover:text-red-800 truncate"
                            >
                              {link.label}
                            </a>
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                          </div>
                          {link.description && (
                            <p className="text-xs text-gray-500 truncate">{link.description}</p>
                          )}
                          <p className="text-xs text-gray-400 truncate">{link.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display General Form in View Mode */}
              {formData.generalForm && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">General Form</Label>
                  <div className="p-3 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{formData.generalForm}</span>
                    </div>
                    {formData.generalFormDeadline && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Deadline: {new Date(formData.generalFormDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {!formData.generalFormDeadline && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Default deadline</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Link Attachment Section Component
interface LinkAttachmentSectionProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
}

function LinkAttachmentSection({ formData, setFormData, isEditing }: LinkAttachmentSectionProps) {
  const [newLink, setNewLink] = useState({ url: '', label: '', description: '' })
  const [showAddLink, setShowAddLink] = useState(false)

  const handleAddLink = () => {
    if (!newLink.url.trim() || !newLink.label.trim()) return

    const linkData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: newLink.url.trim(),
      label: newLink.label.trim(),
      description: newLink.description.trim() || undefined,
    }

    setFormData({
      ...formData,
      links: [...(formData.links || []), linkData],
    })

    setNewLink({ url: '', label: '', description: '' })
    setShowAddLink(false)
  }

  const handleRemoveLink = (linkId: string) => {
    if (!isEditing) return
    
    const updatedLinks = formData.links?.filter(link => link.id !== linkId) || []
    setFormData({ ...formData, links: updatedLinks })
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">Link Attachments</Label>
        <div className="text-xs text-gray-500">
          {formData.links?.length || 0} attached
        </div>
      </div>

      {/* Add Link Button */}
      {isEditing && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddLink(true)}
          className="w-full border-dashed border-gray-300 hover:border-red-400 hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      )}

      {/* Add Link Dialog */}
      {showAddLink && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="link-url" className="text-sm font-medium">
              URL *
            </Label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-label" className="text-sm font-medium">
              Label *
            </Label>
            <Input
              id="link-label"
              placeholder="Enter link label"
              value={newLink.label}
              onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Input
              id="link-description"
              placeholder="Brief description of the link"
              value={newLink.description}
              onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAddLink}
              disabled={!newLink.url.trim() || !newLink.label.trim() || !validateUrl(newLink.url)}
              className="flex-1"
            >
              Add Link
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAddLink(false)
                setNewLink({ url: '', label: '', description: '' })
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Attached Links Preview */}
      {formData.links && formData.links.length > 0 && (
        <div className="space-y-2">
          {formData.links.map((link) => (
            <div key={link.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Link className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-red-600 hover:text-red-800 truncate"
                    >
                      {link.label}
                    </a>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </div>
                  {link.description && (
                    <p className="text-xs text-gray-500 truncate">{link.description}</p>
                  )}
                  <p className="text-xs text-gray-400 truncate">{link.url}</p>
                </div>
              </div>
              
              {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleRemoveLink(link.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// General Form Section Component
interface GeneralFormSectionProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
}

function GeneralFormSection({ formData, setFormData, isEditing }: GeneralFormSectionProps) {
  // Available forms for general use
  const availableForms = [
    { id: "feedback", name: "Feedback Form", description: "Collect general feedback", fields: 5 },
    { id: "registration", name: "Registration Form", description: "General registration form", fields: 8 },
    { id: "survey", name: "Survey Form", description: "General survey form", fields: 12 },
    { id: "contact", name: "Contact Form", description: "Contact information form", fields: 4 },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">General Form</Label>
      </div>

      {/* Form Selection */}
      <div className="space-y-2">
        <Label htmlFor="general-form" className="text-sm font-medium">
          Attach General Form (Optional)
        </Label>
        <Select
          value={formData.generalForm || "none"}
          onValueChange={(value) => setFormData({ ...formData, generalForm: value === "none" ? undefined : value })}
          disabled={!isEditing}
        >
          <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
            <SelectValue placeholder="Select a form to attach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No form attached</SelectItem>
            {availableForms.map((form) => (
              <SelectItem key={form.id} value={form.id}>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-medium">{form.name}</div>
                    <div className="text-xs text-gray-500">{form.description} • {form.fields} fields</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Attach a general form for attendees to fill out
        </p>
      </div>

      {/* Form Deadline Toggle and Input - Only show if a form is selected */}
      {formData.generalForm && formData.generalForm !== "none" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Form Deadline</Label>
              <p className="text-xs text-gray-500">Set a specific deadline for form submission</p>
            </div>
            <Switch
              checked={formData.generalFormDeadlineEnabled || false}
              onCheckedChange={(checked) => setFormData({ ...formData, generalFormDeadlineEnabled: checked })}
              disabled={!isEditing}
            />
          </div>
          
          {formData.generalFormDeadlineEnabled && (
            <div className="space-y-2">
              <Label htmlFor="general-form-deadline" className="text-sm font-medium">
                Deadline Date & Time *
              </Label>
              <Input
                id="general-form-deadline"
                type="datetime-local"
                value={formData.generalFormDeadline || ""}
                onChange={(e) => setFormData({ ...formData, generalFormDeadline: e.target.value })}
                className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
                required={formData.generalFormDeadlineEnabled}
                disabled={!isEditing}
              />
              <p className="text-xs text-gray-500">
                Attendees must submit the form by this deadline
              </p>
            </div>
          )}
          
          {!formData.generalFormDeadlineEnabled && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-gray-600 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium">Default Deadline:</p>
                  <p>• Will use the engagement close date + time</p>
                  <p>• If no close date is set, form remains open indefinitely</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Media Attachment Section Component
interface MediaAttachmentSectionProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
}

function MediaAttachmentSection({ formData, setFormData, isEditing }: MediaAttachmentSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = (files: FileList | null) => {
    if (!files || !isEditing) return

    const newMediaAttachments = Array.from(files).map((file) => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      const isPDF = file.type === 'application/pdf'
      const isExcel = file.type.includes('spreadsheet') || file.type.includes('excel') || 
                     file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')
      const isPowerPoint = file.type.includes('presentation') || file.type.includes('powerpoint') || 
                          file.name.toLowerCase().endsWith('.pptx') || file.name.toLowerCase().endsWith('.ppt')
      const isWord = file.type.includes('document') || file.type.includes('word') || 
                    file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')
      const isZip = file.type.includes('zip') || file.type.includes('compressed') || 
                   file.name.toLowerCase().endsWith('.zip') || file.name.toLowerCase().endsWith('.rar')
      
      if (!isImage && !isVideo && !isPDF && !isExcel && !isPowerPoint && !isWord && !isZip) {
        alert('Please select only supported file types: images, videos, PDF, Excel, PowerPoint, Word, or ZIP files.')
        return null
      }

      let fileType: "image" | "video" | "pdf" | "excel" | "powerpoint" | "word" | "zip"
      if (isImage) fileType = 'image'
      else if (isVideo) fileType = 'video'
      else if (isPDF) fileType = 'pdf'
      else if (isExcel) fileType = 'excel'
      else if (isPowerPoint) fileType = 'powerpoint'
      else if (isWord) fileType = 'word'
      else fileType = 'zip'

      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: fileType,
        size: file.size,
        url: URL.createObjectURL(file),
        thumbnail: isImage ? URL.createObjectURL(file) : undefined,
      }
    }).filter((attachment): attachment is NonNullable<typeof attachment> => attachment !== null).filter(Boolean)

    setFormData({
      ...formData,
      mediaAttachments: [...(formData.mediaAttachments || []), ...newMediaAttachments],
    })
  }

  const handleRemoveMedia = (mediaId: string) => {
    if (!isEditing) return
    
    const updatedMedia = formData.mediaAttachments?.filter(media => media.id !== mediaId) || []
    setFormData({ ...formData, mediaAttachments: updatedMedia })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image className="h-8 w-8 text-red-500" />
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />
      case 'pdf':
        return <FileTextIcon className="h-8 w-8 text-red-500" />
      case 'excel':
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      case 'powerpoint':
        return <Presentation className="h-8 w-8 text-orange-500" />
      case 'word':
        return <FileTextIcon className="h-8 w-8 text-blue-600" />
      case 'zip':
        return <FileArchive className="h-8 w-8 text-gray-500" />
      default:
        return <File className="h-8 w-8 text-gray-400" />
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">Media Attachments</Label>
        <div className="text-xs text-gray-500">
          {formData.mediaAttachments?.length || 0} attached
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragActive
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          Drag and drop files here, or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            browse files
          </button>
        </p>
        <p className="text-xs text-gray-500">
          Supports: Images, Videos, PDF, Excel, PowerPoint, Word, ZIP (Max 10MB per file)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.xlsx,.xls,.pptx,.ppt,.docx,.doc,.zip,.rar"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          aria-label="Upload media files"
        />
      </div>

      {/* Attached Media Preview */}
      {formData.mediaAttachments && formData.mediaAttachments.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {formData.mediaAttachments.map((media) => (
              <div key={media.id} className="relative group">
                {media.type === "image" ? (
                  <img
                    src={media.url}
                    alt={media.name}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                    {getFileIcon(media.type)}
                  </div>
                )}
                
                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleRemoveMedia(media.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                
                {/* File Info */}
                <div className="mt-1">
                  <p className="text-xs text-gray-600 truncate">{media.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(media.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

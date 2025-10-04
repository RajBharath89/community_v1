"use client"

import { useState, useEffect } from "react"
import { X, Save, MessageSquare, Paperclip, Calendar, User, Tag, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useSupportTicketStore, type SupportTicket, type TicketComment } from "@/stores/support-ticket-store"
import { toast } from "sonner"

export function SupportTicketDrawer() {
  const {
    isDrawerOpen,
    drawerMode,
    selectedTicket,
    closeDrawer,
    addTicket,
    updateTicket,
    addComment,
  } = useSupportTicketStore()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General" as SupportTicket["category"],
    priority: "Medium" as SupportTicket["priority"],
    status: "Open" as SupportTicket["status"],
    assignedTo: "",
    tags: [] as string[],
    estimatedResolution: "",
  })

  const [newComment, setNewComment] = useState("")
  const [newTag, setNewTag] = useState("")
  const [isInternalComment, setIsInternalComment] = useState(false)

  useEffect(() => {
    if (selectedTicket && drawerMode !== "create") {
      setFormData({
        title: selectedTicket.title,
        description: selectedTicket.description,
        category: selectedTicket.category,
        priority: selectedTicket.priority,
        status: selectedTicket.status,
        assignedTo: selectedTicket.assignedTo || "",
        tags: selectedTicket.tags || [],
        estimatedResolution: selectedTicket.estimatedResolution || "",
      })
    } else if (drawerMode === "create") {
      setFormData({
        title: "",
        description: "",
        category: "General",
        priority: "Medium",
        status: "Open",
        assignedTo: "",
        tags: [],
        estimatedResolution: "",
      })
    }
  }, [selectedTicket, drawerMode])

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    if (drawerMode === "create") {
      const newTicket: SupportTicket = {
        id: `TKT-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo || undefined,
        createdBy: "Current User", // In a real app, this would come from auth context
        createdDate: new Date().toISOString().split("T")[0],
        updatedDate: new Date().toISOString().split("T")[0],
        attachments: [],
        comments: [],
        tags: formData.tags,
        estimatedResolution: formData.estimatedResolution || undefined,
      }
      addTicket(newTicket)
      toast.success("Ticket created successfully")
    } else if (selectedTicket) {
      updateTicket(selectedTicket.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo || undefined,
        tags: formData.tags,
        estimatedResolution: formData.estimatedResolution || undefined,
      })
      toast.success("Ticket updated successfully")
    }

    closeDrawer()
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTicket) return

    const comment: TicketComment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      author: "Current User", // In a real app, this would come from auth context
      authorRole: "Admin",
      timestamp: new Date().toISOString(),
      isInternal: isInternalComment,
    }

    addComment(selectedTicket.id, comment)
    setNewComment("")
    setIsInternalComment(false)
    toast.success("Comment added successfully")
  }

  const handleAddTag = () => {
    if (!newTag.trim() || formData.tags.includes(newTag)) return
    setFormData({ ...formData, tags: [...formData.tags, newTag] })
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Pending":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const isReadOnly = drawerMode === "view"

  return (
    <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {drawerMode === "create" && "Create New Ticket"}
            {drawerMode === "edit" && "Edit Ticket"}
            {drawerMode === "view" && "View Ticket"}
            {selectedTicket && (
              <Badge className={getPriorityColor(selectedTicket.priority)}>
                {selectedTicket.priority}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Ticket ID and Status (View/Edit only) */}
          {selectedTicket && (
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm text-gray-600">{selectedTicket.id}</div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status}
                </Badge>
                {selectedTicket.priority === "Critical" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter ticket title"
                disabled={isReadOnly}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the issue or request"
                rows={4}
                disabled={isReadOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as SupportTicket["category"] })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Feature Request">Feature Request</SelectItem>
                    <SelectItem value="Bug Report">Bug Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as SupportTicket["priority"] })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!isReadOnly && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as SupportTicket["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    placeholder="Enter assignee name"
                  />
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                    {!isReadOnly && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                        title={`Remove ${tag} tag`}
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {!isReadOnly && (
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} size="sm">
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Estimated Resolution */}
            <div>
              <Label htmlFor="estimatedResolution">Estimated Resolution</Label>
              <Input
                id="estimatedResolution"
                type="date"
                value={formData.estimatedResolution}
                onChange={(e) => setFormData({ ...formData, estimatedResolution: e.target.value })}
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Ticket Details (View only) */}
          {selectedTicket && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Ticket Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Created By</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(selectedTicket.createdBy)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{selectedTicket.createdBy}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600">Created Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(selectedTicket.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {selectedTicket.assignedTo && (
                    <div>
                      <Label className="text-gray-600">Assigned To</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(selectedTicket.assignedTo)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedTicket.assignedTo}</span>
                      </div>
                    </div>
                  )}
                  {selectedTicket.resolvedDate && (
                    <div>
                      <Label className="text-gray-600">Resolved Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{new Date(selectedTicket.resolvedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Comments Section */}
          {selectedTicket && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments ({selectedTicket.comments.length})
                </h3>

                {/* Comments List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedTicket.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg border ${
                        comment.isInternal ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(comment.author)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{comment.author}</span>
                          <Badge variant="outline" className="text-xs">
                            {comment.authorRole}
                          </Badge>
                          {comment.isInternal && (
                            <Badge variant="secondary" className="text-xs">
                              Internal
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                {!isReadOnly && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="internalComment"
                        checked={isInternalComment}
                        onChange={(e) => setIsInternalComment(e.target.checked)}
                        className="rounded"
                        title="Mark as internal comment"
                      />
                      <Label htmlFor="internalComment" className="text-sm">
                        Internal comment (not visible to user)
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="flex-1"
                      />
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Attachments */}
          {selectedTicket?.attachments && selectedTicket.attachments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments ({selectedTicket.attachments.length})
                </h3>
                <div className="space-y-2">
                  {selectedTicket.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          {!isReadOnly && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={closeDrawer}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600">
                <Save className="h-4 w-4 mr-2" />
                {drawerMode === "create" ? "Create Ticket" : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

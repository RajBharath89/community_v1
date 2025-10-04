"use client"

import { useState } from "react"
import type { FormField } from "./form-designer"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

interface EditFieldModalProps {
  field: FormField
  onSave: (field: FormField) => void
  onClose: () => void
}

export function EditFieldModal({ field, onSave, onClose }: EditFieldModalProps) {
  const [formData, setFormData] = useState<FormField>(field)

  const handleSave = () => {
    onSave(formData)
  }

  const updateField = (key: keyof FormField, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Edit {formData.type.charAt(0).toUpperCase() + formData.type.slice(1).replace("-", " ")} Field
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => updateField("label", e.target.value)}
              placeholder="Field label"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Field description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={formData.placeholder || ""}
              onChange={(e) => updateField("placeholder", e.target.value)}
              placeholder="Placeholder text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="className">className</Label>
            <Input
              id="className"
              value={formData.className || ""}
              onChange={(e) => updateField("className", e.target.value)}
              placeholder="CSS classes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Field name"
            />
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={formData.required}
                onCheckedChange={(checked) => updateField("required", checked)}
              />
              <Label htmlFor="required">Required</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="disabled"
                checked={formData.disabled}
                onCheckedChange={(checked) => updateField("disabled", checked)}
              />
              <Label htmlFor="disabled">Disabled</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-black text-white hover:bg-black/90">
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

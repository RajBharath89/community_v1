"use client"

import type { FormField } from "./form-designer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, Trash2, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FormFieldItemProps {
  field: FormField | null
  onEdit: () => void
  onDelete: () => void
  onAddHorizontal: (fieldType: string) => void
  onAddVertical: (fieldType: string) => void
  showHorizontalAdd: boolean
  showVerticalAdd: boolean
}

const FIELD_TYPES = [
  "checkbox",
  "combobox",
  "date-picker",
  "datetime-picker",
  "file-input",
  "input",
  "input-otp",
  "location-input",
  "multi-select",
  "password",
  "phone",
]

const getFieldIcon = (type: string) => {
  switch (type) {
    case "checkbox":
      return "☑"
    case "date-picker":
      return "📅"
    case "file-input":
      return "📁"
    case "input":
      return "📝"
    case "location-input":
      return "📍"
    default:
      return "📝"
  }
}

export function FormFieldItem({
  field,
  onEdit,
  onDelete,
  onAddHorizontal,
  onAddVertical,
  showHorizontalAdd,
  showVerticalAdd,
}: FormFieldItemProps) {
  if (!field) {
    return (
      <div className="relative">
        <Card className="p-4 h-16 border-dashed border-2 border-muted-foreground/20 bg-muted/10">
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Empty</div>
        </Card>

        {/* Horizontal Add Button */}
        {showHorizontalAdd && (
          <div className="absolute -right-6 top-1/2 -translate-y-1/2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="w-8 h-8 rounded-full p-0 bg-background border-2">
                  <Plus className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {FIELD_TYPES.map((type) => (
                  <DropdownMenuItem key={type} onClick={() => onAddHorizontal(type)} className="capitalize">
                    {type.replace("-", " ")}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Vertical Add Button */}
        {showVerticalAdd && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="w-8 h-8 rounded-full p-0 bg-background border-2">
                  <Plus className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {FIELD_TYPES.map((type) => (
                  <DropdownMenuItem key={type} onClick={() => onAddVertical(type)} className="capitalize">
                    {type.replace("-", " ")}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">{getFieldIcon(field.type)}</span>
            <span className="font-medium">{field.label}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onEdit} className="w-8 h-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="w-8 h-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Horizontal Add Button */}
      {showHorizontalAdd && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="w-8 h-8 rounded-full p-0 bg-background border-2">
                <Plus className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {FIELD_TYPES.map((type) => (
                <DropdownMenuItem key={type} onClick={() => onAddHorizontal(type)} className="capitalize">
                  {type.replace("-", " ")}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Vertical Add Button */}
      {showVerticalAdd && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="w-8 h-8 rounded-full p-0 bg-background border-2">
                <Plus className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {FIELD_TYPES.map((type) => (
                <DropdownMenuItem key={type} onClick={() => onAddVertical(type)} className="capitalize">
                  {type.replace("-", " ")}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

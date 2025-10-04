"use client"

import type React from "react"

import { useState } from "react"
import { FormFieldItem } from "./form-field-item"
import { EditFieldModal } from "./edit-field-modal"

export interface FormField {
  id: string
  type: string
  label: string
  description?: string
  placeholder?: string
  className?: string
  name: string
  required: boolean
  disabled: boolean
}

export interface GridPosition {
  row: number
  col: number
}

export function FormDesigner() {
  const [formGrid, setFormGrid] = useState<(FormField | null)[][]>([
    [
      {
        id: "1",
        type: "input",
        label: "Input",
        name: "input_field",
        required: false,
        disabled: false,
      },
    ],
  ])

  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null)

  const addFieldHorizontally = (rowIndex: number, colIndex: number, fieldType: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: fieldType,
      label: fieldType.charAt(0).toUpperCase() + fieldType.slice(1).replace("-", " "),
      name: `${fieldType}_${Date.now()}`,
      required: false,
      disabled: false,
    }

    setFormGrid((prev) => {
      const newGrid = [...prev]
      if (newGrid[rowIndex]) {
        newGrid[rowIndex] = [...newGrid[rowIndex]]
        newGrid[rowIndex][colIndex + 1] = newField
      }
      return newGrid
    })
  }

  const addFieldVertically = (rowIndex: number, colIndex: number, fieldType: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: fieldType,
      label: fieldType.charAt(0).toUpperCase() + fieldType.slice(1).replace("-", " "),
      name: `${fieldType}_${Date.now()}`,
      required: false,
      disabled: false,
    }

    setFormGrid((prev) => {
      const newGrid = [...prev]
      const newRow = [newField]
      newGrid.splice(rowIndex + 1, 0, newRow)
      return newGrid
    })
  }

  const deleteField = (rowIndex: number, colIndex: number) => {
    setFormGrid((prev) => {
      const newGrid = [...prev]
      newGrid[rowIndex] = [...newGrid[rowIndex]]
      newGrid[rowIndex][colIndex] = null
      return newGrid
    })
  }

  const updateField = (updatedField: FormField) => {
    setFormGrid((prev) => {
      const newGrid = prev.map((row) => row.map((field) => (field?.id === updatedField.id ? updatedField : field)))
      return newGrid
    })
    setEditingField(null)
  }

  const handleDragStart = (e: React.DragEvent, rowIndex: number) => {
    setDraggedRowIndex(rowIndex)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetRowIndex: number) => {
    e.preventDefault()

    if (draggedRowIndex === null || draggedRowIndex === targetRowIndex) {
      setDraggedRowIndex(null)
      return
    }

    setFormGrid((prev) => {
      const newGrid = [...prev]
      const draggedRow = newGrid[draggedRowIndex]

      newGrid.splice(draggedRowIndex, 1)

      const insertIndex = draggedRowIndex < targetRowIndex ? targetRowIndex - 1 : targetRowIndex
      newGrid.splice(insertIndex, 0, draggedRow)

      return newGrid
    })

    setDraggedRowIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedRowIndex(null)
  }

  return (
    <div className="h-screen">
      <div className="p-6 overflow-auto h-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Form Designer</h1>

          <div className="space-y-4">
            {formGrid.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex gap-4 transition-all duration-200 ${
                  draggedRowIndex === rowIndex ? "opacity-50 scale-95" : ""
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, rowIndex)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center justify-center w-6 cursor-move text-gray-400 hover:text-gray-600">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="4" cy="4" r="1" />
                    <circle cx="4" cy="8" r="1" />
                    <circle cx="4" cy="12" r="1" />
                    <circle cx="8" cy="4" r="1" />
                    <circle cx="8" cy="8" r="1" />
                    <circle cx="8" cy="12" r="1" />
                    <circle cx="12" cy="4" r="1" />
                    <circle cx="12" cy="8" r="1" />
                    <circle cx="12" cy="12" r="1" />
                  </svg>
                </div>

                {row.map((field, colIndex) => (
                  <div key={`${rowIndex}-${colIndex}`} className="flex-1">
                    <FormFieldItem
                      field={field}
                      onEdit={() => field && setEditingField(field)}
                      onDelete={() => deleteField(rowIndex, colIndex)}
                      onAddHorizontal={(fieldType) => addFieldHorizontally(rowIndex, colIndex, fieldType)}
                      onAddVertical={(fieldType) => addFieldVertically(rowIndex, colIndex, fieldType)}
                      showHorizontalAdd={colIndex === row.length - 1 || !row[colIndex + 1]}
                      showVerticalAdd={rowIndex === formGrid.length - 1}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingField && (
        <EditFieldModal field={editingField} onSave={updateField} onClose={() => setEditingField(null)} />
      )}
    </div>
  )
}

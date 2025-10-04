"use client"

import { Button } from "@/components/ui/button"
import { Plus, Upload, Download } from "lucide-react"
import { useFormStore } from "@/stores/form-store"
import * as XLSX from "xlsx"

export function ActionButtons() {
  const { openDrawer, filteredForms } = useFormStore()

  const handleExportForms = () => {
    const forms = filteredForms()
    const exportData = forms.map((form) => ({
      Name: form.name,
      Description: form.description || "",
      Status: form.status,
      Type: form.formType,
      "Created Date": form.createdDate,
      "Published Date": form.publishedDate || "",
      "Submission Count": form.submissionCount,
      "Completion Rate": `${form.completionRate}%`,
      "Created By": form.createdBy,
      "Is Template": form.isTemplate ? "Yes" : "No",
      "Target Audience": form.targetAudience,
      "Field Count": form.fields.length,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Forms")
    XLSX.writeFile(wb, `forms-export-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleImportForms = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".xlsx,.xls,.csv"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: "array" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)

            console.log("Imported form data:", jsonData)
            // TODO: Process and add imported forms to store
          } catch (error) {
            console.error("Error importing forms:", error)
          }
        }
        reader.readAsArrayBuffer(file)
      }
    }
    input.click()
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <Button
        onClick={handleImportForms}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 hover:bg-gray-50 transition-all duration-200 hover:scale-105 bg-transparent"
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Import</span>
      </Button>
      <Button
        onClick={handleExportForms}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 hover:bg-gray-50 transition-all duration-200 hover:scale-105 bg-transparent"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </Button>
      <Button
        onClick={() => openDrawer("create")}
        size="sm"
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Form</span>
      </Button>
    </div>
  )
}

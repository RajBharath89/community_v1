"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Upload, Download, Plus, FileText, CheckCircle, XCircle } from "lucide-react"
import { useDonationStore } from "@/stores/donation-store"
import * as XLSX from "xlsx"
import { useRef } from "react"
import { toast } from "sonner"

export function ActionButtons() {
  const { openDrawer, filteredDonations, addDonation } = useDonationStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBulkApprove = () => {
    // This would handle bulk approval of donations
    toast.info("Bulk approval feature coming soon!")
  }

  const handleBulkReject = () => {
    // This would handle bulk rejection of donations
    toast.info("Bulk rejection feature coming soon!")
  }

  const handleImportDonations = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("File selected:", file.name)

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Please select a valid Excel file (.xlsx or .xls)")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        console.log("File read successfully")
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        console.log("Parsed JSON data:", jsonData)

        let importedCount = 0
        let errorCount = 0

        jsonData.forEach((row: any, index) => {
          try {
            console.log("Processing row:", row)

            if (!row["Donor Name"] || !row["Donor Email"] || !row.Amount) {
              console.log("Row missing required fields:", { 
                name: row["Donor Name"], 
                email: row["Donor Email"], 
                amount: row.Amount 
              })
              errorCount++
              return
            }

            const newDonation = {
              id: Date.now().toString() + index,
              type: (row.Type === "offline" ? "offline" : row.Type === "material" ? "material" : "online") as "online" | "offline" | "material",
              donor: {
                id: `d${Date.now() + index}`,
                name: row["Donor Name"] || "",
                email: row["Donor Email"] || "",
                phone: row["Donor Phone"] || "",
                street: row["Donor Street"] || "",
                zipcode: row["Donor Zipcode"] || "",
                city: row["Donor City"] || "",
                country: row["Donor Country"] || "",
                message: row["Donor Message"] || ""
              },
              amount: parseFloat(row.Amount) || 0,
              currency: row.Currency || "INR",
              frequency: (row.Frequency || "one-time") as "one-time" | "weekly" | "monthly" | "quarterly" | "yearly",
              paymentMethod: row["Payment Method"] || undefined,
              status: (row.Status === "approved" ? "approved" : 
                     row.Status === "rejected" ? "rejected" : 
                     row.Status === "reviewed" ? "reviewed" : 
                     row.Status === "received" ? "received" : 
                     row.Status === "distributed" ? "distributed" : "pending") as "pending" | "reviewed" | "approved" | "rejected" | "received" | "distributed",
              date: row.Date || new Date().toISOString().split("T")[0],
              receiptFile: row["Receipt File"] || undefined,
              isRecurring: row["Is Recurring"] === "true" || row["Is Recurring"] === true,
              recurringId: row["Recurring ID"] || undefined,
              nextPaymentDate: row["Next Payment Date"] || undefined
            }

            console.log("Created donation object:", newDonation)
            addDonation(newDonation)
            console.log("Donation added to store")
            importedCount++
          } catch (error) {
            console.log("Error processing row:", error)
            errorCount++
          }
        })

        console.log("Import completed:", { importedCount, errorCount })

        // Clear the console logs now that we've fixed the issue
        setTimeout(() => {
          console.clear()
        }, 2000)

        if (importedCount > 0) {
          toast.success(
            `Successfully imported ${importedCount} donations${errorCount > 0 ? ` (${errorCount} errors)` : ""}`,
          )
        } else {
          toast.error("No valid donations found in the Excel file")
        }
      } catch (error) {
        console.log("Error reading Excel file:", error)
        toast.error("Error reading Excel file. Please check the file format.")
      }
    }

    reader.readAsArrayBuffer(file)
    event.target.value = ""
  }

  const handleExportDonations = () => {
    const donations = filteredDonations()

    const exportData = donations.map((donation) => ({
      "Donor Name": donation.donor.name,
      "Donor Email": donation.donor.email,
      "Donor Phone": donation.donor.phone || "",
      "Donor Street": donation.donor.street || "",
      "Donor Zipcode": donation.donor.zipcode || "",
      "Donor City": donation.donor.city || "",
      "Donor Country": donation.donor.country || "",
      "Donor Message": donation.donor.message || "",
      "Amount": donation.amount,
      "Currency": donation.currency,
      "Type": donation.type,
      "Frequency": donation.frequency,
      "Payment Method": donation.paymentMethod || "",
      "Status": donation.status,
      "Date": donation.date,
      "Receipt File": donation.receiptFile || "",
      "Is Recurring": donation.isRecurring || false,
      "Recurring ID": donation.recurringId || "",
      "Next Payment Date": donation.nextPaymentDate || "",
      "Admin Notes": donation.adminNotes || ""
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    const colWidths = [
      { wch: 20 }, // Donor Name
      { wch: 25 }, // Donor Email
      { wch: 15 }, // Donor Phone
      { wch: 25 }, // Donor Street
      { wch: 12 }, // Donor Zipcode
      { wch: 15 }, // Donor City
      { wch: 15 }, // Donor Country
      { wch: 30 }, // Donor Message
      { wch: 10 }, // Amount
      { wch: 8 },  // Currency
      { wch: 10 }, // Type
      { wch: 12 }, // Frequency
      { wch: 15 }, // Payment Method
      { wch: 10 }, // Status
      { wch: 12 }, // Date
      { wch: 20 }, // Receipt File
      { wch: 12 }, // Is Recurring
      { wch: 15 }, // Recurring ID
      { wch: 15 }, // Next Payment Date
      { wch: 30 }, // Admin Notes
    ]
    ws["!cols"] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, "Donations")

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })

    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)

    const currentDate = new Date().toISOString().split("T")[0]
    const filename = `temple-donations-${currentDate}.xlsx`

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full md:w-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        className="hidden"
        aria-label="Import donations from Excel file"
      />
      {/* <Button
        onClick={handleBulkApprove}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <CheckCircle className="h-4 w-4 group-hover:-translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Bulk Approve</span>
        <span className="md:hidden">Approve</span>
      </Button> */}
      {/* <Button
        onClick={handleBulkReject}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <XCircle className="h-4 w-4 group-hover:-translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Bulk Reject</span>
        <span className="md:hidden">Reject</span>
      </Button> */}
      <Button
        onClick={handleImportDonations}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <FileText className="h-4 w-4 group-hover:-translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Import Donations</span>
        <span className="md:hidden">Import</span>
      </Button>
      <Button
        onClick={handleExportDonations}
        variant="outline"
        className="flex items-center justify-center space-x-2 bg-transparent text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group transform-gpu whitespace-nowrap"
      >
        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-all duration-300 transform-gpu" />
        <span className="hidden md:inline">Export List</span>
        <span className="md:hidden">Export</span>
      </Button>
    </div>
  )
}

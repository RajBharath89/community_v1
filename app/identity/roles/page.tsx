"use client"

import { Header } from "@/components/layout/header/header"
import { RolesManagement } from "@/components/identity/roles/roles-management"

export default function RolesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <RolesManagement />
      </main>
    </div>
  )
}

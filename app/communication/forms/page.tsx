import { Header } from "@/components/layout/header/header"
import { FormManagement } from "@/components/communication/forms/form-management"

export default function FormsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <FormManagement />
      </main>
    </div>
  )
}

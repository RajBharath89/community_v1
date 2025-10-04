import { Header } from "@/components/layout/header/header"
import { DonationTemplatesManagement } from "@/components/contributions/donations/donation-templates-management"

export default function DonationTemplatesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <DonationTemplatesManagement />
      </main>
    </div>
  )
}

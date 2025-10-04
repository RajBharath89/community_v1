import { Header } from "@/components/layout/header/header"
import { DonationRequestForm } from "@/components/contributions/donations/donation-request-form"

export default function DonationRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-3 py-8">
        <DonationRequestForm />
      </main>
    </div>
  )
}

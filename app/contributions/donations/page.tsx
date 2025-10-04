import { Header } from "@/components/layout/header/header"
import DonationManagement from "@/components/contributions/donations/donation-management"

export default function DonationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <DonationManagement />
      </main>
    </div>
  )
}

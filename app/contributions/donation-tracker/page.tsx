import { Header } from "@/components/layout/header/header"
import { DonationTracker } from "@/components/contributions/donations/donation-tracker"

export default function DonationTrackerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-3 py-8">
        <DonationTracker />
      </main>
    </div>
  )
}

import { Header } from "@/components/layout/header/header"
import SupportTicketManagement from "@/components/communication/support/support-ticket-management"

export default function SupportTicketsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <SupportTicketManagement />
      </main>
    </div>
  )
}

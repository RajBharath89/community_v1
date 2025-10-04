import { Header } from "@/components/layout/header/header"
import EngagementManagement from "@/components/communication/engagements/engagement-management"

export default function EngagementsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <EngagementManagement />
      </main>
    </div>
  )
}

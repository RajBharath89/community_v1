import { Header } from "@/components/layout/header/header"
import VolunteerManagement from "@/components/communication/engagements/volunteer-management/volunteer-management"

export default function VolunteersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <VolunteerManagement />
      </main>
    </div>
  )
}

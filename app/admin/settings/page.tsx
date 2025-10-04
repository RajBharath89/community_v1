import { Header } from "@/components/layout/header/header"
import SettingsManagement from "@/components/admin/settings/settings-management"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <SettingsManagement />
      </main>
    </div>
  )
}

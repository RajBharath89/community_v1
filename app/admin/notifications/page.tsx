import { Header } from "@/components/layout/header/header"
import { NotificationsManagement } from "@/components/admin/notifications/notifications-list"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <NotificationsManagement />
      </main>
    </div>
  )
}

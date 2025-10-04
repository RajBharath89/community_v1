import { Header } from "@/components/layout/header/header"
import ProfileManagement from "@/components/profile/profile-management"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <ProfileManagement />
      </main>
    </div>
  )
}

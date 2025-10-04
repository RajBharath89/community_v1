import { Header } from "@/components/layout/header/header"
import { UserManagement } from "@/components/identity/users/user-management"

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <UserManagement />
      </main>
    </div>
  )
}

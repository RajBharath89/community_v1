import { Header } from "@/components/layout/header/header"
import GroupManagement from "@/components/identity/groups/group-management"

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <GroupManagement />
      </main>
    </div>
  )
}

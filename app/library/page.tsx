import { Header } from "@/components/layout/header/header"
import LibraryManagement from "@/components/library/library-management"

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-3 py-4">
        <LibraryManagement />
      </main>
    </div>
  )
}

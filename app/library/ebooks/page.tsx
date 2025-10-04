import { Header } from "@/components/layout/header/header"
import LibraryManagement from "@/components/library/library-management"

export default function EbooksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <LibraryManagement />
      </main>
    </div>
  )
}

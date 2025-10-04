import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function TableSkeleton() {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nuki Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Join Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="ml-3">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-6 w-16 rounded-full" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-6 w-16 rounded-full" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-8 w-8 rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CardSkeleton({ viewMode }: { viewMode: "table" | "card" }) {
  return (
    <div
      className={
        viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4" : "lg:hidden space-y-4 p-4"
      }
    >
      {Array.from({ length: viewMode === "card" ? 6 : 3 }).map((_, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Skeleton className="h-3 w-12 mb-2" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div>
                <Skeleton className="h-3 w-12 mb-2" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div>
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div>
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-3 sm:p-4 relative overflow-hidden shadow-lg"
        >
          <Skeleton className="absolute left-0 top-0 bottom-0 w-1.5" />
          <div className="flex items-center justify-between pl-2">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-6 w-8" />
            </div>
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

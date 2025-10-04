import { ActionButtons } from "./action-buttons"
import { StatsCards } from "./stats-cards"
import { GroupTable } from "./group-table"
import { GroupDrawer } from "./group-drawer"
import { AdvancedFilterDrawer } from "./advanced-filter-drawer"

function GroupManagement() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="relative bg-gradient-to-r from-red-50 to-orange-45 rounded-xl p-6 border border-red-100">
        <div className="absolute left-4 top-4 opacity-70">
          <img
            src="/sai-baba-with-devotees-showing-community-unity-and.png"
            alt="Sai Baba with devotees"
            className="w-20 h-20 object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="relative z-10 ml-28">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Group Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Organize users into groups for targeted communication and management
            </p>
          </div>
          <div className="flex-shrink-0 relative z-10">
            <ActionButtons />
          </div>
        </div>
      </div>
      <StatsCards />
      <GroupTable />
      <GroupDrawer />
      <AdvancedFilterDrawer />
    </div>
  )
}

export default GroupManagement
export { GroupManagement }

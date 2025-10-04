import { User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

export function ProfileDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleSettingsClick = () => {
    router.push('/admin/settings')
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
          <div className="relative">
            <Avatar className="w-6 h-6">
              <AvatarImage src={user.avatar || "/sai-baba-peaceful-face-with-orange-turban.png"} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
            {/* Role indicator dot */}
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              user.role === 'admin' ? 'bg-red-500' :
              user.role === 'priest' ? 'bg-purple-500' :
              user.role === 'volunteer' ? 'bg-pink-500' :
              'bg-blue-500'
            }`}></div>
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-56 p-0" align="end">
        <div className="p-4 pb-2">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                user.role === 'admin' ? 'bg-red-100 text-red-800 border border-red-200' :
                user.role === 'priest' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                user.role === 'volunteer' ? 'bg-pink-100 text-pink-800 border border-pink-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="p-1">
          <div 
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm"
            onClick={handleProfileClick}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </div>
          <div 
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm"
            onClick={handleSettingsClick}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </div>
        </div>
        <Separator />
        <div className="p-1">
          <div 
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm text-red-600"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

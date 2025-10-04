"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"

export function AuthButtons() {
  const { isAuthenticated, logout } = useAuth()

  if (isAuthenticated) {
    return (
      <Button
        onClick={logout}
        variant="ghost"
        className="text-white hover:bg-white/10 h-9 px-3"
      >
        Logout
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Link href="/login">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 h-9 px-3"
        >
          Sign In
        </Button>
      </Link>
      <Link href="/register">
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 h-9 px-3"
        >
          Sign Up
        </Button>
      </Link>
    </div>
  )
}

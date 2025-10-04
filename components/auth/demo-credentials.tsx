"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Eye, EyeOff, Info } from "lucide-react"

const DEMO_CREDENTIALS = [
  {
    role: "Admin",
    phone: "31612345678",
    username: "Admin User",
    description: "Full access to all features and user management"
  },
  {
    role: "Priest", 
    phone: "31612345679",
    username: "Priest Sharma",
    description: "Access to religious ceremonies and spiritual content"
  },
  {
    role: "Volunteer",
    phone: "31612345680", 
    username: "Volunteer Kumar",
    description: "Access to volunteer activities and community features"
  },
  {
    role: "Devotee",
    phone: "31612345681",
    username: "Devotee Singh",
    description: "Basic access to temple services and spiritual content"
  }
]

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin': return 'bg-red-100 text-red-800 border-red-200'
    case 'priest': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'volunteer': return 'bg-pink-100 text-pink-800 border-pink-200'
    case 'devotee': return 'bg-blue-100 text-blue-800 border-blue-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function DemoCredentials() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm">
          <Info className="w-4 h-4 mr-2" />
          Demo Credentials
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Demo Login Credentials</DialogTitle>
          <DialogDescription>
            Use these phone numbers to test different user roles. Any password will work.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {DEMO_CREDENTIALS.map((cred, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge className={getRoleColor(cred.role)}>
                  {cred.role}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Phone:</span>
                  <code className="text-sm bg-white px-2 py-1 rounded border flex-1">
                    {cred.phone}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(cred.phone)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Username:</span>
                  <span className="text-sm text-gray-700">{cred.username}</span>
                </div>
                <p className="text-xs text-gray-600">{cred.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> These are demo credentials for testing purposes. 
            In production, roles will be determined by the backend based on phone number registration.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

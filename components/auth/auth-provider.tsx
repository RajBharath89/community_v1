"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  phone: string
  email?: string
  name: string
  role: 'admin' | 'priest' | 'volunteer' | 'devotee'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (phone: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  sendOTP: (phone: string) => Promise<boolean>
  verifyOTP: (phone: string, otp: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user data with predefined roles based on phone numbers
const DEMO_USERS = {
  '+31612345678': { // Netherlands Admin
    id: '1',
    name: 'Admin User',
    role: 'admin' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '+31612345679': { // Netherlands Priest
    id: '2', 
    name: 'Priest Sharma',
    role: 'priest' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '+31612345680': { // Netherlands Volunteer
    id: '3',
    name: 'Volunteer Kumar',
    role: 'volunteer' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '+31612345681': { // Netherlands Devotee
    id: '4',
    name: 'Devotee Singh',
    role: 'devotee' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  // Alternative formats for Netherlands numbers
  '+3131612345678': { // Netherlands Admin (alternative format)
    id: '1',
    name: 'Admin User',
    role: 'admin' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '+3131612345679': { // Netherlands Priest (alternative format)
    id: '2', 
    name: 'Priest Sharma',
    role: 'priest' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '+3131612345680': { // Netherlands Volunteer (alternative format)
    id: '3',
    name: 'Volunteer Kumar',
    role: 'volunteer' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '+3131612345681': { // Netherlands Devotee (alternative format)
    id: '4',
    name: 'Devotee Singh',
    role: 'devotee' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  // Phone numbers without country code prefix
  '31612345678': { // Netherlands Admin (no prefix)
    id: '1',
    name: 'Admin User',
    role: 'admin' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '31612345679': { // Netherlands Priest (no prefix)
    id: '2', 
    name: 'Priest Sharma',
    role: 'priest' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '31612345680': { // Netherlands Volunteer (no prefix)
    id: '3',
    name: 'Volunteer Kumar',
    role: 'volunteer' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '31612345681': { // Netherlands Devotee (no prefix)
    id: '4',
    name: 'Devotee Singh',
    role: 'devotee' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '+919876543210': { // India Admin
    id: '5',
    name: 'Admin Patel',
    role: 'admin' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '+919876543211': { // India Priest
    id: '6',
    name: 'Priest Joshi',
    role: 'priest' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '+919876543212': { // India Volunteer
    id: '7',
    name: 'Volunteer Reddy',
    role: 'volunteer' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  },
  '+919876543213': { // India Devotee
    id: '8',
    name: 'Devotee Gupta',
    role: 'devotee' as const,
    avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
  }
}

// Helper function to get user role based on phone number
const getUserRole = (phone: string): 'admin' | 'priest' | 'volunteer' | 'devotee' => {
  const user = DEMO_USERS[phone as keyof typeof DEMO_USERS]
  return user ? user.role : 'devotee' // Default to devotee for new registrations
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        // In a real app, you'd check localStorage, cookies, or make an API call
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          // Force update avatar to Sai Baba image for all users
          userData.avatar = '/sai-baba-peaceful-face-with-orange-turban.png'
          setUser(userData)
          // Update localStorage with new avatar
          localStorage.setItem('user', JSON.stringify(userData))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (phone: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Normalize phone number (remove any spaces or formatting)
      const normalizedPhone = phone.replace(/\s/g, '')
      console.log('Login attempt with phone:', normalizedPhone)
      
      // Check if phone number exists in demo users
      const demoUser = DEMO_USERS[normalizedPhone as keyof typeof DEMO_USERS]
      console.log('Found demo user:', demoUser)
      
      if (demoUser) {
        // Existing demo user
        const user: User = {
          ...demoUser,
          phone: normalizedPhone
        }
        console.log('Setting user:', user)
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        return true
      } else {
        // New user - default to devotee role
        const user: User = {
          id: Date.now().toString(),
          phone: normalizedPhone,
          name: `User ${normalizedPhone.slice(-4)}`,
          role: 'devotee',
          avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
        }
        console.log('Creating new user:', user)
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        return true
      }
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Normalize phone number (remove any spaces or formatting)
      const normalizedPhone = userData.phone.replace(/\s/g, '')
      console.log('Registration attempt with phone:', normalizedPhone)
      
      // Check if phone number exists in demo users
      const demoUser = DEMO_USERS[normalizedPhone as keyof typeof DEMO_USERS]
      console.log('Found demo user for registration:', demoUser)
      
      if (demoUser) {
        // Existing demo user - use their predefined role
        const user: User = {
          ...demoUser,
          phone: normalizedPhone,
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`
        }
        console.log('Setting registered user:', user)
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        return true
      } else {
        // New user - default to devotee role
        const user: User = {
          id: Date.now().toString(),
          phone: normalizedPhone,
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          role: 'devotee',
          avatar: '/sai-baba-peaceful-face-with-orange-turban.png'
        }
        console.log('Creating new registered user:', user)
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        return true
      }
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      setLoading(true)
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`OTP sent to ${phone}`)
      return true
    } catch (error) {
      console.error('Failed to send OTP:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    try {
      setLoading(true)
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Mock OTP verification (accept any 6-digit OTP for demo)
      return otp.length === 6 && /^\d+$/.test(otp)
    } catch (error) {
      console.error('OTP verification failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    // Redirect to login page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    sendOTP,
    verifyOTP,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

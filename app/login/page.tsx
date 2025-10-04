"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Phone, Lock } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { PhoneInput } from "@/components/ui/phone-input"
import { DemoCredentials } from "@/components/auth/demo-credentials"
import { AuthLeftSection } from "@/components/auth/auth-left-section"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const success = await login(formData.phone, formData.password)
      if (success) {
        router.push("/")
      } else {
        setError("Invalid phone number or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Sai Baba Images and Quotes */}
      <AuthLeftSection />

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-6 sm:p-8 bg-white min-h-screen">
        <div className="w-full max-w-md">
          {/* Desktop Logo/Brand */}
          <div className="hidden lg:flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <img
                src="/sai-baba-peaceful-face-with-orange-turban.png"
                alt="Sai Baba"
                className="w-16 h-16 rounded-full border-4 border-red-100 shadow-lg"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur opacity-30"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">ABC</h1>
            <p className="text-sm text-gray-600">Shirdi Sai Baba Temple</p>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="relative">
              <img
                src="/sai-baba-peaceful-face-with-orange-turban.png"
                alt="Sai Baba"
                className="w-16 h-16 rounded-full border-4 border-red-100 shadow-lg"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur opacity-30"></div>
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="space-y-4 text-center pb-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to your ABC account to continue your spiritual journey
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Phone Field */}
                <PhoneInput
                  value={formData.phone}
                  onChange={(phone) => setFormData({ ...formData, phone })}
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  required
                />

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me and Forgot password */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      aria-label="Remember me"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              {/* Sign up link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Demo Credentials */}
          <div className="flex justify-center mt-5">
            <DemoCredentials />
          </div>
        </div>
      </div>
    </div>
  )
}

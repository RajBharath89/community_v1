"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, ArrowLeft, CheckCircle, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { PhoneInput } from "@/components/ui/phone-input"
import { OTPInput } from "@/components/ui/otp-input"
import { AuthLeftSection } from "@/components/auth/auth-left-section"

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<'phone' | 'otp' | 'password' | 'success'>('phone')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { sendOTP, verifyOTP } = useAuth()
  const router = useRouter()

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) {
      setError("Please enter your phone number")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const success = await sendOTP(phone)
      if (success) {
        setStep('otp')
      } else {
        setError("Failed to send OTP. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const success = await verifyOTP(phone, otp)
      if (success) {
        setStep('password')
      } else {
        setError("Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStep('success')
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex">
        {/* Left Section - Sai Baba Images and Quotes */}
        <AuthLeftSection />

        {/* Right Section - Success Message */}
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

            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="space-y-4 text-center pb-6">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-gray-900">Password Reset Successful</CardTitle>
                  <CardDescription className="text-gray-600">
                    Your password has been successfully reset. You can now sign in with your new password.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <Link href="/login">
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Continue to Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Sai Baba Images and Quotes */}
      <AuthLeftSection />

      {/* Right Section - Forgot Password Form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-6 sm:p-8 bg-white min-h-screen">
        <div className="w-full max-w-md">
          {/* Back to login link */}
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>

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
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {step === 'phone' && 'Reset Your Password'}
                  {step === 'otp' && 'Verify Your Phone'}
                  {step === 'password' && 'Create New Password'}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {step === 'phone' && 'Enter your phone number to receive a verification code'}
                  {step === 'otp' && `We've sent a verification code to ${phone}`}
                  {step === 'password' && 'Please create a new password for your account'}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
            {/* Step 1: Phone Number */}
            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  required
                />

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
                  {isLoading ? "Sending Code..." : "Send Verification Code"}
                </Button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 text-center block">
                    Enter Verification Code
                  </Label>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    length={6}
                    className="justify-center"
                  />
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
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                {/* Resend OTP */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => sendOTP(phone)}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            )}

            {/* Help text */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
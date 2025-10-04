"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User, Phone, ArrowLeft, CheckCircle, Mail } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { PhoneInput } from "@/components/ui/phone-input"
import { OTPInput } from "@/components/ui/otp-input"
import { AuthLeftSection } from "@/components/auth/auth-left-section"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone')
  const [otp, setOtp] = useState("")
  const { register, sendOTP, verifyOTP } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.phone) {
      setError("Please enter your phone number")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const success = await sendOTP(formData.phone)
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
      const success = await verifyOTP(formData.phone, otp)
      if (success) {
        setStep('details')
      } else {
        setError("Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    
    try {
      const success = await register(formData)
      if (success) {
        router.push("/")
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Sai Baba Images and Quotes */}
      <AuthLeftSection />

      {/* Right Section - Registration Form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-6 sm:p-8 bg-white min-h-screen">
        <div className="w-full max-w-md">
          {/* Back button */}
          {step !== 'phone' && (
            <button 
              onClick={() => setStep(step === 'otp' ? 'phone' : 'otp')}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

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
                  {step === 'phone' && 'Join Our Community'}
                  {step === 'otp' && 'Verify Your Phone'}
                  {step === 'details' && 'Complete Your Profile'}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {step === 'phone' && 'Create your ABC account and begin your spiritual journey with us'}
                  {step === 'otp' && `We've sent a verification code to ${formData.phone}`}
                  {step === 'details' && 'Please complete your profile information'}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
            {/* Step 1: Phone Number */}
            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <PhoneInput
                  value={formData.phone}
                  onChange={(phone) => setFormData({ ...formData, phone })}
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
                  {isLoading ? "Sending OTP..." : "Send Verification Code"}
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
                    onClick={() => sendOTP(formData.phone)}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Complete Profile */}
            {step === 'details' && (
              <form onSubmit={handleFinalSubmit} className="space-y-3">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10 h-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10 h-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email ID
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                {/* Verified Phone Display */}
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">{formData.phone}</span>
                    <span className="text-xs text-green-600">Verified</span>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
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
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
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
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-0.5"
                    aria-label="Accept terms and conditions"
                    required
                  />
                  <Label htmlFor="acceptTerms" className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-red-600 hover:text-red-700 transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-red-600 hover:text-red-700 transition-colors">
                      Privacy Policy
                    </Link>
                  </Label>
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
                  className="w-full h-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            )}

            {/* Sign in link */}
            <div className="text-center pt-1">
              <p className="text-xs text-gray-600">
                Already have an account?{" "}
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

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  className?: string
  disabled?: boolean
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  className,
  disabled = false,
}: OTPInputProps) {
  const [otp, setOtp] = React.useState<string[]>(new Array(length).fill(""))
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  React.useEffect(() => {
    if (value) {
      const otpArray = value.split("").slice(0, length)
      const newOtp = [...otp]
      otpArray.forEach((digit, index) => {
        if (index < length) {
          newOtp[index] = digit
        }
      })
      setOtp(newOtp)
    }
  }, [value, length])

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)
    onChange(newOtp.join(""))

    // Focus next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    const pastedArray = pastedData.split("")
    const newOtp = [...otp]
    
    pastedArray.forEach((digit, index) => {
      if (index < length) {
        newOtp[index] = digit
      }
    })
    
    setOtp(newOtp)
    onChange(newOtp.join(""))
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit, index) => !digit && index < length)
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className={cn("flex space-x-2 justify-center", className)}>
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold border-gray-200 focus:border-red-500 focus:ring-red-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        />
      ))}
    </div>
  )
}

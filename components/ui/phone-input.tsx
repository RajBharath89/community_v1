"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CountryOption {
  code: string
  country: string
  flag: React.ReactNode
}

const FlagImage = ({ src, alt }: { src: string; alt: string }) => (
  <img
    src={src}
    alt={alt}
    width={20}
    height={14}
    className="inline-block h-[14px] w-[20px] rounded-sm object-cover"
    loading="eager"
    decoding="async"
  />
)

const countryCodes: CountryOption[] = [
  { code: "+31", country: "Netherlands", flag: <FlagImage src="/flags/nl.png" alt="Netherlands flag" /> },
  { code: "+91", country: "India", flag: <FlagImage src="/flags/in.png" alt="India flag" /> },
]

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

export function PhoneInput({
  value,
  onChange,
  placeholder = "Enter phone number",
  className,
  label,
  required = false,
  disabled = false,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = React.useState(countryCodes[0]) // Default to Netherlands
  const [isOpen, setIsOpen] = React.useState(false)
  const [phoneNumber, setPhoneNumber] = React.useState("")

  React.useEffect(() => {
    // Parse existing value if provided
    if (value) {
      const foundCountry = countryCodes.find(country => value.startsWith(country.code))
      if (foundCountry) {
        setSelectedCountry(foundCountry)
        setPhoneNumber(value.replace(foundCountry.code, "").trim())
      }
    }
  }, [value])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value.replace(/\D/g, "") // Only allow digits
    setPhoneNumber(newPhone)
    onChange(`${selectedCountry.code}${newPhone}`)
  }

  const handleCountrySelect = (country: typeof countryCodes[0]) => {
    setSelectedCountry(country)
    setIsOpen(false)
    onChange(`${country.code}${phoneNumber}`)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-12 px-3 border-gray-200 focus:border-red-500 focus:ring-red-500 focus:z-10",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <span className="mr-2 flex items-center">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.code}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          
          {isOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {countryCodes.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="text-lg flex items-center">{country.flag}</span>
                  <span className="text-sm font-medium">{country.code}</span>
                  <span className="text-sm text-gray-600">{country.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Phone Number Input */}
        <Input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className={cn(
            "h-12 flex-1 focus:border-red-500 focus:ring-red-500 focus:z-10",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
          required={required}
        />
      </div>
    </div>
  )
}

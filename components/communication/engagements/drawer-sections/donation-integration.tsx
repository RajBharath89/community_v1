"use client"

import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Engagement } from "@/stores/engagement-store"
 

interface DonationIntegrationProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

export function DonationIntegration({ formData, setFormData, isEditing, validationErrors }: DonationIntegrationProps) {
  const handleDonationToggle = (enabled: boolean) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      donationIntegration: {
        ...formData.donationIntegration,
        enabled,
        // Ensure required fields always exist; UI is hidden
        donationType: formData.donationIntegration?.donationType ?? "general",
        paymentMethods: formData.donationIntegration?.paymentMethods ?? ["online"],
        goalType: formData.donationIntegration?.goalType ?? "none",
        goalAmount: formData.donationIntegration?.goalAmount ?? 0,
        suggestedAmounts: formData.donationIntegration?.suggestedAmounts ?? [],
        customMessage: formData.donationIntegration?.customMessage ?? "",
        taxDeductible: formData.donationIntegration?.taxDeductible ?? false,
        receiptEnabled: formData.donationIntegration?.receiptEnabled ?? false,
        anonymousOption: formData.donationIntegration?.anonymousOption ?? false,
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center space-x-2">
        <Heart className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-medium">Donation Integration</h3>
      </div> */}

      {/* Enable/Disable Donation Integration */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Enable Donation Integration</CardTitle>
            <Switch
              checked={formData.donationIntegration?.enabled || false}
              onCheckedChange={handleDonationToggle}
              disabled={!isEditing}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Connect this engagement with the temple's donation system to facilitate contributions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

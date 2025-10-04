"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"

export function DonationSettings() {
  const { templeSettings, updateTempleSettings } = useSettingsStore()
  const [newCategory, setNewCategory] = useState("")

  const handleDonationChange = (field: string, value: any) => {
    updateTempleSettings({
      donations: {
        ...templeSettings.donations,
        [field]: value,
      },
    })
  }

  const handlePaymentSettingsChange = (field: string, value: any) => {
    updateTempleSettings({
      donations: {
        ...templeSettings.donations,
        paymentSettings: {
          ...templeSettings.donations.paymentSettings!,
          [field]: value,
        },
      },
    })
  }

  const addDonationCategory = () => {
    if (newCategory.trim() && !templeSettings.donations.donationCategories.includes(newCategory.trim())) {
      handleDonationChange("donationCategories", [
        ...templeSettings.donations.donationCategories,
        newCategory.trim(),
      ])
      setNewCategory("")
    }
  }

  const removeDonationCategory = (category: string) => {
    handleDonationChange(
      "donationCategories",
      templeSettings.donations.donationCategories.filter((c) => c !== category)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Donation Settings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">General Donation Settings</CardTitle>
              <CardDescription>Configure basic donation preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableOnlineDonations">Enable Online Donations</Label>
                  <p className="text-sm text-gray-500">Allow users to make donations online</p>
                </div>
                <Switch
                  id="enableOnlineDonations"
                  checked={templeSettings.donations.enableOnlineDonations}
                  onCheckedChange={(checked) => handleDonationChange("enableOnlineDonations", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoReceiptGeneration">Auto Receipt Generation</Label>
                  <p className="text-sm text-gray-500">Automatically generate receipts for donations</p>
                </div>
                <Switch
                  id="autoReceiptGeneration"
                  checked={templeSettings.donations.autoReceiptGeneration}
                  onCheckedChange={(checked) => handleDonationChange("autoReceiptGeneration", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="taxDeductible">Tax Deductible</Label>
                  <p className="text-sm text-gray-500">Donations are tax deductible</p>
                </div>
                <Switch
                  id="taxDeductible"
                  checked={templeSettings.donations.taxDeductible}
                  onCheckedChange={(checked) => handleDonationChange("taxDeductible", checked)}
                />
              </div>
              {templeSettings.donations.taxDeductible && (
                <div>
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={templeSettings.donations.taxId}
                    onChange={(e) => handleDonationChange("taxId", e.target.value)}
                    placeholder="80G/123456789"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Donation Limits</CardTitle>
              <CardDescription>Set minimum and maximum donation amounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="minimumDonationAmount">Minimum Amount</Label>
                <Input
                  id="minimumDonationAmount"
                  type="number"
                  value={templeSettings.donations.minimumDonationAmount}
                  onChange={(e) => handleDonationChange("minimumDonationAmount", parseFloat(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="maximumDonationAmount">Maximum Amount</Label>
                <Input
                  id="maximumDonationAmount"
                  type="number"
                  value={templeSettings.donations.maximumDonationAmount}
                  onChange={(e) => handleDonationChange("maximumDonationAmount", parseFloat(e.target.value))}
                  min="1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Payment Gateway</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Provider</CardTitle>
            <CardDescription>Configure payment gateway settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentGateway">Payment Gateway</Label>
              <Select
                value={templeSettings.donations.paymentGateway}
                onValueChange={(value) => handleDonationChange("paymentGateway", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentApiKey">API Key</Label>
                <Input
                  id="paymentApiKey"
                  value={templeSettings.donations.paymentSettings?.apiKey || ""}
                  onChange={(e) => handlePaymentSettingsChange("apiKey", e.target.value)}
                  placeholder="Your API key"
                />
              </div>
              <div>
                <Label htmlFor="paymentApiSecret">API Secret</Label>
                <Input
                  id="paymentApiSecret"
                  type="password"
                  value={templeSettings.donations.paymentSettings?.apiSecret || ""}
                  onChange={(e) => handlePaymentSettingsChange("apiSecret", e.target.value)}
                  placeholder="Your API secret"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="paymentWebhookSecret">Webhook Secret</Label>
                <Input
                  id="paymentWebhookSecret"
                  type="password"
                  value={templeSettings.donations.paymentSettings?.webhookSecret || ""}
                  onChange={(e) => handlePaymentSettingsChange("webhookSecret", e.target.value)}
                  placeholder="Your webhook secret"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Donation Categories</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Available Categories</CardTitle>
            <CardDescription>Manage donation categories for better organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {templeSettings.donations.donationCategories.map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  <span>{category}</span>
                  <button
                    onClick={() => removeDonationCategory(category)}
                    className="text-red-500 hover:text-red-700"
                    title={`Remove ${category} category`}
                    aria-label={`Remove ${category} category`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
                onKeyPress={(e) => e.key === "Enter" && addDonationCategory()}
              />
              <Button onClick={addDonationCategory} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

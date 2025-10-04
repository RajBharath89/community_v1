"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Share2, Link, Mail, MessageSquare, Calendar, Globe, Lock, Copy, QrCode, Send, Eye } from "lucide-react"
import type { Form, FormSettings } from "@/stores/form-store"

interface FormDistributionProps {
  formData: Partial<Form>
  updateSettings: (updates: Partial<FormSettings>) => void
  isEditing: boolean
}

export function FormDistribution({ formData, updateSettings, isEditing }: FormDistributionProps) {
  const generateFormUrl = () => {
    const baseUrl = window.location.origin
    const formId = formData.id || "new-form"
    return `${baseUrl}/forms/${formId}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const generateQRCode = () => {
    const url = generateFormUrl()
    // This would integrate with a QR code library
    console.log("Generate QR code for:", url)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Form Link & Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link className="h-5 w-5" />
            <span>Form Link</span>
          </CardTitle>
          <CardDescription>Generate and share your form link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Form URL</Label>
            <div className="flex items-center space-x-2">
              <Input value={generateFormUrl()} readOnly className="bg-gray-50" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateFormUrl())}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Access</Label>
              <p className="text-sm text-gray-500">Allow anyone with link to access</p>
            </div>
            <Switch
              checked={formData.settings?.publicAccess || false}
              onCheckedChange={(checked) => updateSettings({ publicAccess: checked })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Password Protection</Label>
              <p className="text-sm text-gray-500">Require password to access form</p>
            </div>
            <Switch
              checked={formData.settings?.passwordProtected || false}
              onCheckedChange={(checked) => updateSettings({ passwordProtected: checked })}
              disabled={!isEditing}
            />
          </div>

          {formData.settings?.passwordProtected && (
            <div className="space-y-2">
              <Label htmlFor="formPassword">Form Password</Label>
              <Input
                id="formPassword"
                type="password"
                value={formData.settings?.formPassword || ""}
                onChange={(e) => updateSettings({ formPassword: e.target.value })}
                placeholder="Enter form password"
                disabled={!isEditing}
              />
            </div>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={generateQRCode}>
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Distribution Channels</span>
          </CardTitle>
          <CardDescription>Choose how to distribute your form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Distribution</span>
              </Label>
              <p className="text-sm text-gray-500">Send form via email</p>
            </div>
            <Switch
              checked={formData.settings?.emailDistribution || false}
              onCheckedChange={(checked) => updateSettings({ emailDistribution: checked })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>SMS Distribution</span>
              </Label>
              <p className="text-sm text-gray-500">Send form via SMS</p>
            </div>
            <Switch
              checked={formData.settings?.smsDistribution || false}
              onCheckedChange={(checked) => updateSettings({ smsDistribution: checked })}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Website Embed</span>
              </Label>
              <p className="text-sm text-gray-500">Embed form on website</p>
            </div>
            <Switch
              checked={formData.settings?.websiteEmbed || false}
              onCheckedChange={(checked) => updateSettings({ websiteEmbed: checked })}
              disabled={!isEditing}
            />
          </div>

          {(formData.settings?.emailDistribution || formData.settings?.smsDistribution) && (
            <div className="space-y-2">
              <Label htmlFor="distributionMessage">Distribution Message</Label>
              <Textarea
                id="distributionMessage"
                value={formData.settings?.distributionMessage || ""}
                onChange={(e) => updateSettings({ distributionMessage: e.target.value })}
                placeholder="Enter message to accompany form distribution"
                disabled={!isEditing}
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Form Scheduling</span>
          </CardTitle>
          <CardDescription>Schedule when your form becomes available</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Schedule Publication</Label>
              <p className="text-sm text-gray-500">Set when form becomes active</p>
            </div>
            <Switch
              checked={formData.settings?.scheduledPublication || false}
              onCheckedChange={(checked) => updateSettings({ scheduledPublication: checked })}
              disabled={!isEditing}
            />
          </div>

          {formData.settings?.scheduledPublication && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={formData.settings?.publishDate || ""}
                  onChange={(e) => updateSettings({ publishDate: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishTime">Publish Time</Label>
                <Input
                  id="publishTime"
                  type="time"
                  value={formData.settings?.publishTime || ""}
                  onChange={(e) => updateSettings({ publishTime: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={formData.settings?.timezone || "UTC"}
              onValueChange={(value) => updateSettings({ timezone: value })}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Asia/Kolkata">India Standard Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Access Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Access Controls</span>
          </CardTitle>
          <CardDescription>Control who can access and submit your form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxSubmissions">Maximum Submissions</Label>
            <Input
              id="maxSubmissions"
              type="number"
              value={formData.settings?.maxSubmissions || ""}
              onChange={(e) => updateSettings({ maxSubmissions: Number.parseInt(e.target.value) || undefined })}
              placeholder="Unlimited"
              disabled={!isEditing}
            />
            <p className="text-sm text-gray-500">Leave empty for unlimited submissions</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>IP Restrictions</Label>
              <p className="text-sm text-gray-500">Limit access by IP address</p>
            </div>
            <Switch
              checked={formData.settings?.ipRestrictions || false}
              onCheckedChange={(checked) => updateSettings({ ipRestrictions: checked })}
              disabled={!isEditing}
            />
          </div>

          {formData.settings?.ipRestrictions && (
            <div className="space-y-2">
              <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
              <Textarea
                id="allowedIPs"
                value={formData.settings?.allowedIPs || ""}
                onChange={(e) => updateSettings({ allowedIPs: e.target.value })}
                placeholder="Enter IP addresses, one per line"
                disabled={!isEditing}
                rows={3}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Submission Limit per User</Label>
              <p className="text-sm text-gray-500">Limit submissions per user</p>
            </div>
            <Switch
              checked={formData.settings?.userSubmissionLimit || false}
              onCheckedChange={(checked) => updateSettings({ userSubmissionLimit: checked })}
              disabled={!isEditing}
            />
          </div>

          {formData.settings?.userSubmissionLimit && (
            <div className="space-y-2">
              <Label htmlFor="submissionsPerUser">Submissions per User</Label>
              <Input
                id="submissionsPerUser"
                type="number"
                value={formData.settings?.submissionsPerUser || 1}
                onChange={(e) => updateSettings({ submissionsPerUser: Number.parseInt(e.target.value) || 1 })}
                disabled={!isEditing}
                min="1"
              />
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>Views: {formData.viewCount || 0}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Send className="h-3 w-3" />
                <span>Submissions: {formData.submissionCount || 0}</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  AlertTriangle, 
  CheckCircle,
  Thermometer,
  Umbrella,
  Calendar,
  Clock,
  MapPin,
  Settings
} from "lucide-react"
import type { Engagement } from "@/stores/engagement-store"
import { useState } from "react"

interface WeatherIntegrationProps {
  formData: Partial<Engagement>
  setFormData: (data: Partial<Engagement>) => void
  isEditing: boolean
  validationErrors: Record<string, string>
}

const weatherConditions = [
  { value: "sunny", label: "Sunny", icon: Sun, description: "Clear skies, good for outdoor events" },
  { value: "partly-cloudy", label: "Partly Cloudy", icon: Cloud, description: "Some clouds, generally good weather" },
  { value: "cloudy", label: "Cloudy", icon: Cloud, description: "Overcast skies" },
  { value: "rainy", label: "Rainy", icon: CloudRain, description: "Rain expected" },
  { value: "stormy", label: "Stormy", icon: CloudRain, description: "Thunderstorms possible" },
  { value: "snowy", label: "Snowy", icon: CloudSnow, description: "Snow expected" },
  { value: "windy", label: "Windy", icon: Wind, description: "High winds expected" },
]

const eventTypes = [
  { value: "outdoor", label: "Outdoor Event", description: "Event held outside" },
  { value: "indoor", label: "Indoor Event", description: "Event held inside" },
  { value: "hybrid", label: "Hybrid Event", description: "Both indoor and outdoor components" },
  { value: "weather-dependent", label: "Weather Dependent", description: "Event depends on weather conditions" },
]

const weatherAlerts = [
  { value: "none", label: "No Alerts", description: "No weather alerts" },
  { value: "light-rain", label: "Light Rain Alert", description: "Notify if light rain is expected" },
  { value: "heavy-rain", label: "Heavy Rain Alert", description: "Notify if heavy rain is expected" },
  { value: "storm", label: "Storm Alert", description: "Notify if storms are expected" },
  { value: "extreme-temp", label: "Extreme Temperature", description: "Notify for extreme temperatures" },
  { value: "wind", label: "High Wind Alert", description: "Notify for high winds" },
]

export function WeatherIntegration({ formData, setFormData, isEditing, validationErrors }: WeatherIntegrationProps) {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  const handleWeatherToggle = (enabled: boolean) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      weatherIntegration: {
        ...formData.weatherIntegration,
        enabled,
        // Reset to defaults when enabling
        ...(enabled && {
          eventType: "outdoor",
          weatherDependent: false,
          checkWeather: true,
          weatherAlerts: ["light-rain"],
          backupPlan: "",
          weatherCheckDays: 3,
          autoNotify: true,
          location: "",
          temperatureUnit: "celsius",
        })
      }
    })
  }

  const updateWeatherField = (field: string, value: any) => {
    if (!isEditing) return
    
    setFormData({
      ...formData,
      weatherIntegration: {
        ...formData.weatherIntegration,
        [field]: value
      }
    })
  }

  const handleAlertToggle = (alert: string) => {
    if (!isEditing) return
    
    const currentAlerts = formData.weatherIntegration?.weatherAlerts || []
    const newAlerts = currentAlerts.includes(alert)
      ? currentAlerts.filter(a => a !== alert)
      : [...currentAlerts, alert]
    
    updateWeatherField("weatherAlerts", newAlerts)
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "partly-cloudy":
        return <Cloud className="h-6 w-6 text-gray-400" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      case "stormy":
        return <CloudRain className="h-6 w-6 text-purple-500" />
      case "snowy":
        return <CloudSnow className="h-6 w-6 text-blue-300" />
      case "windy":
        return <Wind className="h-6 w-6 text-gray-600" />
      default:
        return <Cloud className="h-6 w-6 text-gray-400" />
    }
  }

  const getWeatherStatus = () => {
    const forecast = formData.weatherIntegration?.forecast
    if (!forecast) {
      return { status: "no-data", message: "No weather data available" }
    }
    
    const condition = forecast.condition
    const temperature = forecast.temperature
    const isOutdoor = formData.weatherIntegration?.eventType === "outdoor"
    
    if (isOutdoor && (condition === "rainy" || condition === "stormy" || condition === "snowy")) {
      return { status: "warning", message: "Weather may affect outdoor event", condition }
    } else if (condition === "sunny" || condition === "partly-cloudy") {
      return { status: "good", message: "Good weather for event", condition }
    } else {
      return { status: "neutral", message: "Weather conditions normal", condition }
    }
  }

  const weatherStatus = getWeatherStatus()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Cloud className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Weather Integration</h3>
      </div>

      {/* Enable/Disable Weather Integration */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Enable Weather Integration</CardTitle>
            <Switch
              checked={formData.weatherIntegration?.enabled || false}
              onCheckedChange={handleWeatherToggle}
              disabled={!isEditing}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Monitor weather conditions and plan weather-dependent events accordingly.
          </p>
        </CardContent>
      </Card>

      {formData.weatherIntegration?.enabled && (
        <>
          {/* Event Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Event Type *</Label>
            <Select
              value={formData.weatherIntegration?.eventType || "outdoor"}
              onValueChange={(value) => updateWeatherField("eventType", value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weather Dependent Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Weather Dependent Event</Label>
              <p className="text-xs text-gray-500">Event success depends on weather conditions</p>
            </div>
            <Switch
              checked={formData.weatherIntegration?.weatherDependent || false}
              onCheckedChange={(checked) => updateWeatherField("weatherDependent", checked)}
              disabled={!isEditing}
            />
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label htmlFor="weather-location" className="text-sm font-medium">
              Event Location
            </Label>
            <Input
              id="weather-location"
              placeholder="Enter event location for weather data"
              value={formData.weatherIntegration?.location || ""}
              onChange={(e) => updateWeatherField("location", e.target.value)}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
              disabled={!isEditing}
            />
            <p className="text-xs text-gray-500">
              Leave empty to use temple's default location
            </p>
          </div>

          {/* Weather Check Settings */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-blue-800">Weather Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Check Weather</Label>
                  <p className="text-xs text-gray-500">Automatically check weather conditions</p>
                </div>
                <Switch
                  checked={formData.weatherIntegration?.checkWeather || false}
                  onCheckedChange={(checked) => updateWeatherField("checkWeather", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weather-check-days" className="text-sm font-medium">
                  Check Days in Advance
                </Label>
                <Select
                  value={formData.weatherIntegration?.weatherCheckDays?.toString() || "3"}
                  onValueChange={(value) => updateWeatherField("weatherCheckDays", parseInt(value))}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day before</SelectItem>
                    <SelectItem value="2">2 days before</SelectItem>
                    <SelectItem value="3">3 days before</SelectItem>
                    <SelectItem value="5">5 days before</SelectItem>
                    <SelectItem value="7">1 week before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Auto Notifications</Label>
                  <p className="text-xs text-gray-500">Send weather alerts to attendees</p>
                </div>
                <Switch
                  checked={formData.weatherIntegration?.autoNotify || false}
                  onCheckedChange={(checked) => updateWeatherField("autoNotify", checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Weather Alerts */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Weather Alerts</Label>
            <div className="grid grid-cols-2 gap-2">
              {weatherAlerts.map((alert) => (
                <div
                  key={alert.value}
                  className={`p-2 border rounded text-sm cursor-pointer transition-all ${
                    formData.weatherIntegration?.weatherAlerts?.includes(alert.value)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleAlertToggle(alert.value)}
                >
                  <div className="font-medium">{alert.label}</div>
                  <div className="text-xs text-gray-500">{alert.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Backup Plan */}
          <div className="space-y-3">
            <Label htmlFor="backup-plan" className="text-sm font-medium">
              Backup Plan
            </Label>
            <Textarea
              id="backup-plan"
              placeholder="Describe backup plan for bad weather (e.g., move indoors, reschedule, etc.)"
              value={formData.weatherIntegration?.backupPlan || ""}
              onChange={(e) => updateWeatherField("backupPlan", e.target.value)}
              rows={3}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-500"
              disabled={!isEditing}
            />
            <p className="text-xs text-gray-500">
              This plan will be shared with attendees if weather conditions are unfavorable
            </p>
          </div>

          {/* Advanced Settings */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Advanced Settings</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  disabled={!isEditing}
                >
                  {showAdvancedSettings ? "Hide" : "Show"}
                </Button>
              </div>
            </CardHeader>
            {showAdvancedSettings && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature-unit" className="text-sm font-medium">
                    Temperature Unit
                  </Label>
                  <Select
                    value={formData.weatherIntegration?.temperatureUnit || "celsius"}
                    onValueChange={(value) => updateWeatherField("temperatureUnit", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="hover:border-red-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select temperature unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Current Weather Status */}
          {formData.weatherIntegration?.forecast && (
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-green-800">Weather Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getWeatherIcon(weatherStatus.condition)}
                    <div>
                      <div className="font-medium">{weatherStatus.message}</div>
                      <div className="text-sm text-gray-600">
                        {formData.weatherIntegration.forecast.temperature}°{formData.weatherIntegration.temperatureUnit === "celsius" ? "C" : "F"}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      weatherStatus.status === "good" ? "text-green-600 border-green-300" :
                      weatherStatus.status === "warning" ? "text-yellow-600 border-yellow-300" :
                      "text-gray-600 border-gray-300"
                    }
                  >
                    {weatherStatus.status === "good" ? "Good" : 
                     weatherStatus.status === "warning" ? "Warning" : "Normal"}
                  </Badge>
                </div>
                
                {formData.weatherIntegration.backupPlan && weatherStatus.status === "warning" && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <div className="font-medium">Backup Plan Available:</div>
                        <div className="text-xs mt-1">{formData.weatherIntegration.backupPlan}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Weather Statistics (View Mode) */}
          {!isEditing && formData.weatherIntegration?.forecast && (
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-purple-800">Weather Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formData.weatherIntegration.forecast.temperature}°
                    </div>
                    <div className="text-sm text-purple-700">Temperature</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formData.weatherIntegration.forecast.humidity || "N/A"}%
                    </div>
                    <div className="text-sm text-blue-700">Humidity</div>
                  </div>
                </div>
                {formData.weatherIntegration.forecast.windSpeed && (
                  <div className="mt-3 pt-3 border-t border-purple-200 text-center">
                    <div className="text-lg font-bold text-gray-600">
                      {formData.weatherIntegration.forecast.windSpeed} km/h
                    </div>
                    <div className="text-sm text-gray-700">Wind Speed</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Save, 
  Clock, 
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Database
} from "lucide-react"

interface DataManagementProps {
  formData: any
  setFormData: (data: any) => void
  isEditing: boolean
  onSave: () => void
  lastSaved?: string
  hasUnsavedChanges: boolean
}

export function DataManagement({ 
  formData, 
  setFormData, 
  isEditing, 
  onSave,
  lastSaved,
  hasUnsavedChanges
}: DataManagementProps) {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveProgress, setSaveProgress] = useState(0)

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!isEditing || !hasUnsavedChanges) return

    setAutoSaveStatus('saving')
    setSaveProgress(0)

    try {
      // Simulate auto-save progress
      const interval = setInterval(() => {
        setSaveProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 50)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      clearInterval(interval)
      setSaveProgress(100)
      setAutoSaveStatus('saved')
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setAutoSaveStatus('idle')
        setSaveProgress(0)
      }, 2000)

    } catch (error) {
      setAutoSaveStatus('error')
      setSaveProgress(0)
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setAutoSaveStatus('idle')
      }, 3000)
    }
  }, [isEditing, hasUnsavedChanges])

  // Auto-save effect
  useEffect(() => {
    if (!isEditing) return

    const timeoutId = setTimeout(autoSave, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [formData, autoSave, isEditing])

  const getAutoSaveStatusIcon = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'saved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Save className="h-4 w-4 text-gray-400" />
    }
  }

  const getAutoSaveStatusText = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return 'Auto-saving...'
      case 'saved':
        return 'Auto-saved'
      case 'error':
        return 'Auto-save failed'
      default:
        return hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'
    }
  }

  const getAutoSaveStatusColor = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return 'text-blue-600'
      case 'saved':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return hasUnsavedChanges ? 'text-yellow-600' : 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Auto-save Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-teal-500" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto-save Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getAutoSaveStatusIcon()}
              <span className={`text-sm font-medium ${getAutoSaveStatusColor()}`}>
                {getAutoSaveStatusText()}
              </span>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                disabled={autoSaveStatus === 'saving'}
                className="hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Now
              </Button>
            )}
          </div>

          {/* Save Progress */}
          {autoSaveStatus === 'saving' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Saving changes...</span>
                <span>{saveProgress}%</span>
              </div>
              <Progress value={saveProgress} className="h-2" />
            </div>
          )}

          {/* Last Saved Info */}
          {lastSaved && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Last saved: {new Date(lastSaved).toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            Form Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Content Length</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formData.content?.length || 0} characters
              </div>
              <div className="text-xs text-gray-500">
                {formData.content ? Math.ceil((formData.content.length || 0) / 5) : 0} words
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Created</span>
              </div>
              <div className="text-sm text-gray-900">
                {formData.createdDate ? new Date(formData.createdDate).toLocaleDateString() : 'Not set'}
              </div>
              <div className="text-xs text-gray-500">
                by {formData.createdBy || 'Unknown'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Last Modified</span>
              </div>
              <div className="text-sm text-gray-900">
                {formData.lastModified ? new Date(formData.lastModified).toLocaleDateString() : 'Not set'}
              </div>
              <div className="text-xs text-gray-500">
                {formData.lastModified ? new Date(formData.lastModified).toLocaleTimeString() : ''}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Attachments</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formData.attachments?.length || 0} files
              </div>
              <div className="text-xs text-gray-500">
                {formData.attachedForms?.length || 0} forms attached
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Validation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Basic Information</span>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Content</span>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Delivery Channels</span>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                Configured
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Target Audience</span>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                Selected
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

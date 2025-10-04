"use client"

import { useState } from "react"
import { useBroadcastStore } from "@/stores/broadcast-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  Send,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Pause,
  Play,
  Trash2,
  Calendar,
  Users,
  Eye,
} from "lucide-react"

export function DeliveryQueue() {
  const { broadcasts, updateBroadcast, deleteBroadcast } = useBroadcastStore()
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  const queuedBroadcasts = broadcasts.filter(
    (b) => b.status === "Scheduled" || b.status === "Sending" || b.status === "Failed",
  )

  const handleRetry = async (broadcastId: string) => {
    setProcessingIds((prev) => new Set(prev).add(broadcastId))

    // Simulate retry process
    setTimeout(() => {
      updateBroadcast(broadcastId, { status: "Sending" })

      // Simulate successful delivery after retry
      setTimeout(() => {
        updateBroadcast(broadcastId, {
          status: "Sent",
          sentDate: new Date().toISOString().split("T")[0],
          deliveredCount: Math.floor(Math.random() * 100) + 50,
          readCount: Math.floor(Math.random() * 50) + 20,
          clickCount: Math.floor(Math.random() * 20) + 5,
        })
        setProcessingIds((prev) => {
          const newSet = new Set(prev)
          newSet.delete(broadcastId)
          return newSet
        })
      }, 2000)
    }, 1000)
  }

  const handlePause = (broadcastId: string) => {
    updateBroadcast(broadcastId, { status: "Draft" })
  }

  const handleResume = (broadcastId: string) => {
    updateBroadcast(broadcastId, { status: "Scheduled" })
  }

  const handleCancel = (broadcastId: string) => {
    deleteBroadcast(broadcastId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "text-yellow-700 border-yellow-200 bg-yellow-50"
      case "Sending":
        return "text-blue-700 border-blue-200 bg-blue-50"
      case "Failed":
        return "text-red-700 border-red-200 bg-red-50"
      case "Sent":
        return "text-green-700 border-green-200 bg-green-50"
      default:
        return "text-gray-700 border-gray-200 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Clock className="h-3 w-3" />
      case "Sending":
        return <Send className="h-3 w-3" />
      case "Failed":
        return <AlertTriangle className="h-3 w-3" />
      case "Sent":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  if (queuedBroadcasts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-500" />
            Delivery Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No broadcasts in queue</p>
            <p className="text-sm text-gray-400 mt-1">Scheduled and pending broadcasts will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-500" />
            Delivery Queue
          </div>
          <Badge variant="outline" className="text-red-600 border-red-200">
            {queuedBroadcasts.length} in queue
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queuedBroadcasts.map((broadcast, index) => (
            <div key={broadcast.id}>
              <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{broadcast.title}</h4>
                    <Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor(broadcast.status)}`}>
                      {getStatusIcon(broadcast.status)}
                      {broadcast.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{broadcast.scheduledDate || broadcast.createdDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{broadcast.totalRecipients} recipients</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          broadcast.priority === "Urgent"
                            ? "text-red-600 border-red-200"
                            : broadcast.priority === "Normal"
                              ? "text-blue-600 border-blue-200"
                              : "text-green-600 border-green-200"
                        }`}
                      >
                        {broadcast.priority}
                      </Badge>
                    </div>
                    {broadcast.status === "Sent" && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{broadcast.readCount} reads</span>
                      </div>
                    )}
                  </div>

                  {broadcast.status === "Failed" && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      Delivery failed. Click retry to attempt again.
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {broadcast.status === "Failed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRetry(broadcast.id)}
                      disabled={processingIds.has(broadcast.id)}
                      className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    >
                      {processingIds.has(broadcast.id) ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                    </Button>
                  )}

                  {broadcast.status === "Scheduled" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePause(broadcast.id)}
                        className="hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200"
                      >
                        <Pause className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(broadcast.id)}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}

                  {broadcast.status === "Draft" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResume(broadcast.id)}
                      className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              {index < queuedBroadcasts.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

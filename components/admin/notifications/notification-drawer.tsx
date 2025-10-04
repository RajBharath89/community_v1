"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useNotificationStore } from "@/stores/notification-store"

export function NotificationDrawer() {
  const { isDrawerOpen, closeDrawer, selectedNotification } = useNotificationStore()

  return (
    <Dialog open={isDrawerOpen} onOpenChange={closeDrawer}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Notification Details</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedNotification.title}</h3>
                <p className="text-gray-600 mt-2">{selectedNotification.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {selectedNotification.type}
                </div>
                <div>
                  <span className="font-medium">Priority:</span> {selectedNotification.priority}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {selectedNotification.unread ? "Unread" : "Read"}
                </div>
                <div>
                  <span className="font-medium">Time:</span> {selectedNotification.time}
                </div>
              </div>
            </div>
          )}
          
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useLibraryStore } from "@/stores/library-store"
import { ActionModal } from "./action-modal"

export function ActionModalWrapper() {
  const { isActionModalOpen, closeActionModal, actionModalItem, actionModalAction } = useLibraryStore()

  return (
    <ActionModal
      isOpen={isActionModalOpen}
      onClose={closeActionModal}
      item={actionModalItem}
      action={actionModalAction}
    />
  )
}

"use client"

import { useState } from "react"
import { LibraryItem } from "@/stores/library-store"
import { MediaPlayer } from "./media-player"
import { DocumentReader } from "./document-reader"
import { ImageViewer } from "./image-viewer"

interface ActionModalProps {
  isOpen: boolean
  onClose: () => void
  item: LibraryItem | null
  action: "read" | "play" | "view" | null
}

export function ActionModal({ isOpen, onClose, item, action }: ActionModalProps) {
  if (!item || !action) return null

  // Render the appropriate player/viewer based on action and item type
  if (action === "play" && (item.type === "audiobook" || item.type === "video")) {
    return (
      <MediaPlayer
        isOpen={isOpen}
        onClose={onClose}
        item={item}
      />
    )
  }

  if (action === "read" && (item.type === "ebook" || item.type === "document")) {
    return (
      <DocumentReader
        isOpen={isOpen}
        onClose={onClose}
        item={item}
      />
    )
  }

  if (action === "view" && item.type === "image") {
    return (
      <ImageViewer
        isOpen={isOpen}
        onClose={onClose}
        item={item}
      />
    )
  }

  // Fallback for unsupported combinations
  return null
}

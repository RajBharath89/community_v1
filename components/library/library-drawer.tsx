"use client"

import { useLibraryStore } from "@/stores/library-store"
import { LibraryDrawerContent } from "./library-drawer-content"

export function LibraryDrawer() {
  const { isDrawerOpen, closeDrawer, drawerMode, selectedItem } = useLibraryStore()

  if (!isDrawerOpen) return null

  return (
    <LibraryDrawerContent
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      mode={drawerMode}
      item={selectedItem}
    />
  )
}

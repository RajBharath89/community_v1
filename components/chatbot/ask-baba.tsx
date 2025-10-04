"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getRandomQuote } from "./ask-baba-quotes"

export default function AskBabaChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [quote, setQuote] = useState<string>("")

  const headerTitle = useMemo(() => "Ask Baba", [])

  useEffect(() => {
    if (isOpen && !quote) {
      setQuote(getRandomQuote())
    }
  }, [isOpen, quote])

  function handleBless() {
    setQuote(prev => getRandomQuote(prev))
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Ask Baba chatbot"
          className="relative h-14 w-14 rounded-full border-2 border-orange-500 shadow-lg overflow-hidden bg-white baba-glow"
        >
          <Image
            src="/sai-baba-serene-face-with-orange-turban-and-peacef.png"
            alt="Ask Baba"
            fill
            sizes="56px"
            className="object-cover"
            priority
          />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[90vw] max-w-sm">
      <Card className="shadow-xl border border-gray-200 bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-semibold">SB</span>
            <h3 className="text-sm font-semibold">{headerTitle}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} aria-label="Close Ask Baba chatbot">
            ✕
          </Button>
        </div>

        <div className="px-4 py-3 space-y-3 max-h-[50vh] overflow-auto">
          <p className="text-sm text-gray-700">Receive Sai Baba's blessings with a quote.</p>
          {quote ? (
            <div className="rounded-md bg-orange-50 border border-orange-200 p-3">
              <p className="text-sm text-orange-900">“{quote}”</p>
            </div>
          ) : (
            <div className="rounded-md bg-gray-50 border p-3">
              <p className="text-sm text-gray-600">Click the button below to receive a blessing.</p>
            </div>
          )}
        </div>

        <div className="px-4 pb-4 pt-1 flex gap-2 justify-end">
          <Button onClick={handleBless} className="bg-orange-600 hover:bg-orange-700">Bless me</Button>
        </div>
      </Card>
    </div>
  )
}



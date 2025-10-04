"use client"

import { useState, useEffect } from "react"
import { Quote } from "lucide-react"

const SAI_BABA_IMAGES = [
  "/sai-baba-peaceful-face-with-orange-turban.png",
  "/sai-baba-blessing-devotees-in-temple-setting-with-.png",
  "/sai-baba-reading-sacred-texts-surrounded-by-books-.png",
  "/sai-baba-receiving-offerings-and-donations-with-ha.png",
  "/sai-baba-serene-face-with-orange-turban-and-peacef.png",
  "/sai-baba-teaching-and-speaking-to-gathered-devotee.png",
  "/sai-baba-with-devotees-showing-community-unity-and.png"
]

const SAI_BABA_QUOTES = [
  {
    text: "Love all, serve all. Help ever, hurt never.",
    author: "Sai Baba"
  },
  {
    text: "The mind is like a mirror. It reflects what is placed before it.",
    author: "Sai Baba"
  },
  {
    text: "Be wherever you like, do whatever you choose, remember this well that all what you do is known to me.",
    author: "Sai Baba"
  },
  {
    text: "Why fear when I am here?",
    author: "Sai Baba"
  },
  {
    text: "Your duty is to work and leave the results to me.",
    author: "Sai Baba"
  },
  {
    text: "I am the slave of my devotees.",
    author: "Sai Baba"
  },
  {
    text: "The path of devotion is the easiest and most pleasant path to reach God.",
    author: "Sai Baba"
  }
]

export function AuthLeftSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  useEffect(() => {
    // Rotate images every 4 seconds
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SAI_BABA_IMAGES.length)
    }, 4000)

    // Rotate quotes every 6 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % SAI_BABA_QUOTES.length)
    }, 6000)

    return () => {
      clearInterval(imageInterval)
      clearInterval(quoteInterval)
    }
  }, [])

  return (
    <div className="hidden md:flex md:w-2/5 lg:w-3/5 md:h-screen bg-gradient-to-br from-red-600 via-red-700 to-orange-600 relative overflow-hidden">
      {/* Background decorative elements - Reduced opacity to not interfere with images */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/3 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full w-full">
        {/* Full Background Image Carousel */}
        <div className="absolute inset-0 w-full h-full">
          <img
            key={currentImageIndex}
            src={SAI_BABA_IMAGES[currentImageIndex]}
            alt="Sai Baba"
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Quote Section - Moved to bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full px-8">
          <div className="flex items-center justify-center mb-4">
            <Quote className="w-8 h-8 text-white/90" />
          </div>
          <blockquote className="text-lg leading-relaxed mb-3 italic text-white font-medium">
            "{SAI_BABA_QUOTES[currentQuoteIndex].text}"
          </blockquote>
          <cite className="text-sm text-white/80">
            — {SAI_BABA_QUOTES[currentQuoteIndex].author}
          </cite>
        </div>


        {/* Additional decorative elements - Overlay on image */}
        <div className="absolute top-8 left-8 w-16 h-16 border-2 border-white/30 rounded-full"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-white/30 rounded-full"></div>
        <div className="absolute top-1/3 right-8 w-8 h-8 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-1/3 left-8 w-6 h-6 bg-white/20 rounded-full"></div>
      </div>
    </div>
  )
}

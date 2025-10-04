import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import Script from "next/script"
import { AuthProvider } from "@/components/auth/auth-provider"
import AskBabaChatbot from "@/components/chatbot/ask-baba"

export const metadata: Metadata = {
  title: "ABC",
  description: "Manage temple members, priests, volunteers, and trustees",
  generator: "ABC",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`${GeistSans.className} antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
        <AskBabaChatbot />
        <Analytics />
      </body>
    </html>
  )
}

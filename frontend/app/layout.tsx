import type React from "react"
import { Abel } from "next/font/google"
import { Providers } from "@/lib/providers"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

// Initialize the Abel font
const abel = Abel({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "CitizenConnect | Public Complaint Portal",
  description: "A seamless platform for citizens to submit and track complaints",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={abel.className}>
      <body className="bg-white text-black">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReduxProvider } from "@/redux/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Citizen Complaints and Engagement System",
  description:
    "A platform for citizens to submit complaints and engage with government officials",
  authors: [
    { name: "Ishimwe Sibomana Bienvenu", url: "https://bienvenu.vercel.app/" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}

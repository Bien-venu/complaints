"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/">
                <Logo className="h-8 w-auto" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === item.href
                      ? "border-b-2 border-[#157037] text-[#157037]"
                      : "border-transparent text-gray-600 hover:border-gray-300 hover:text-[#157037]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <UserNav />
            ) : (
              <>
                <Button variant="ghost" asChild className="text-gray-600 hover:text-[#157037]">
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild className="bg-[#157037] hover:bg-[#157037]/90 text-white">
                  <Link href="/auth/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-[#157037] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#157037]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 pl-3 pr-4 text-base font-medium ${
                  pathname === item.href
                    ? "bg-[#157037]/10 border-l-4 border-[#157037] text-[#157037]"
                    : "border-transparent text-gray-600 hover:bg-gray-100 hover:border-l-4 hover:border-[#157037]/40 hover:text-[#157037]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="border-t pb-3 pt-4">
            {isAuthenticated ? (
              <div className="flex items-center px-4">
                <UserNav />
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-4">
                <Button
                  variant="outline"
                  asChild
                  className="justify-center border-gray-300 text-gray-600 hover:text-[#157037]"
                >
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild className="justify-center bg-[#157037] hover:bg-[#157037]/90 text-white">
                  <Link href="/auth/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

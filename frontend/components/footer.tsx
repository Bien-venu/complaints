import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <div className="flex justify-center">
          <Logo className="h-10 w-auto" />
        </div>
        <nav className="mt-8 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-6">
            <Link href="/about" className="text-sm leading-6 text-gray-600 hover:text-[#157037]">
              About
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/faq" className="text-sm leading-6 text-gray-600 hover:text-[#157037]">
              FAQ
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/contact" className="text-sm leading-6 text-gray-600 hover:text-[#157037]">
              Contact
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/privacy" className="text-sm leading-6 text-gray-600 hover:text-[#157037]">
              Privacy Policy
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/terms" className="text-sm leading-6 text-gray-600 hover:text-[#157037]">
              Terms of Service
            </Link>
          </div>
        </nav>
        <p className="mt-8 text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} CitizenConnect. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

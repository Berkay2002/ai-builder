"use client"

import { Globe } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "./ui/button"
import { cn } from "@/utils/cn"

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])
  return scrolled
}

export default function Navbar() {
  const scrolled = useScrolled()

  return (
    <header className="fixed inset-x-0 top-0 z-30 pointer-events-none">
      <div className="mx-auto px-4">
        <nav
          className={cn(
            "pointer-events-auto mt-4 mx-auto flex items-center justify-between rounded-full px-6 py-3 transition-all w-[90%] sm:w-[88%] lg:w-[85%] bg-white shadow-md ring-1 ring-black/10",
            scrolled ? "shadow-lg" : "shadow-md"
          )}
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="h-6 w-6 rounded-full ring-2 ring-orange-300/60"
              style={{
                background:
                  "conic-gradient(from 0deg, #f97316, #fdba74, #f59e0b, #f97316)",
              }}
            />
            <span className="font-semibold">Novu</span>
          </div>

          {/* Center: Links */}
          <ul className="hidden gap-8 text-sm font-medium text-gray-700 sm:flex">
            <li className="hover:text-gray-900 transition-colors cursor-pointer">
              Product
            </li>
            <li className="hover:text-gray-900 transition-colors cursor-pointer">
              Resources
            </li>
            <li className="hover:text-gray-900 transition-colors cursor-pointer">
              Pricing
            </li>
            <li className="hover:text-gray-900 transition-colors cursor-pointer">
              Enterprise
            </li>
          </ul>

          {/* Right: Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex rounded-full"
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">Change language</span>
            </Button>
            <Button
              className="rounded-full bg-lime-200 text-gray-900 hover:bg-lime-300"
              size="sm"
            >
              Start Building
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}

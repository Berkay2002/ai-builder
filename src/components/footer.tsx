import { Globe } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Import from Figma", href: "#" },
      { label: "Videos", href: "#" },
      { label: "Roadmap", href: "#" },
      { label: "Status", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Solutions", href: "#" },
      { label: "Hire a Partner", href: "#" },
      { label: "How‑To Guides", href: "#" },
      { label: "Become a Partner", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Launched", href: "#" },
      { label: "Enterprise", href: "#" },
      { label: "Learn", href: "#" },
      { label: "Support", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Affiliates", href: "#" },
      { label: "Press & Media", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
      { label: "Report Abuse", href: "#" },
      { label: "Report Security Concerns", href: "#" },
      { label: "Do Not Sell or Share My Info", href: "#" },
      { label: "Trust Center", href: "#" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "X / Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Discord", href: "#" },
      { label: "Reddit", href: "#" },
    ],
  },
]

export default function FooterCard() {
  return (
    <footer aria-labelledby="footer-heading" className="relative mt-24">
      {/* Subtle backdrop to separate footer region from hero while keeping your theme */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-black/0 via-black/0 to-black/5" />

      <div className="mx-auto max-w-6xl px-4">
        <Card
          className="
            rounded-[28px]
            overflow-hidden isolate
            border border-black/5
            bg-white/70 backdrop-blur
            ring-1 ring-black/5
            shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_20px_60px_-20px_rgba(0,0,0,0.25),0_6px_18px_-6px_rgba(0,0,0,0.15)]
          "
        >
          <CardContent className="p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-12">
              {/* Brand / locale column */}
              <div className="md:col-span-3">
                <div className="flex items-center gap-2">
                  <div
                    aria-hidden="true"
                    className="h-8 w-8 rounded-xl ring-2 ring-orange-300/60"
                    style={{
                      background: "conic-gradient(from 0deg, #f97316, #fdba74, #f59e0b, #f97316)",
                    }}
                  />
                  <span className="text-base font-semibold text-gray-900">Novu</span>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-gray-700">
                  <Globe className="h-4 w-4" />
                  <span>EN</span>
                </div>
              </div>

              {/* Link columns */}
              {columns.map((col) => (
                <nav key={col.title} aria-label={col.title} className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-900">{col.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a href={l.href} className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>

            {/* Bottom bar (optional) */}
            <div className="mt-10 border-t border-black/5 pt-6 text-xs text-gray-600">
              © {new Date().getFullYear()} Novu. All rights reserved.
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  )
}

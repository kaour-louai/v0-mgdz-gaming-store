'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Storefront } from '@/components/storefront'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/logo.jpg"
              alt="MGDZ Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-xl text-foreground">MGDZ</span>
          </Link>

          <nav className="flex items-center gap-6">
            <span className="text-foreground font-medium">
              Graphics Cards Store
            </span>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Storefront />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="MGDZ"
                className="h-6 w-6 object-contain"
              />
              <span className="font-bold text-foreground">MGDZ Gaming Store</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Graphics Cards Store
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

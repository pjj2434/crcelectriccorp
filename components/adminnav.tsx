"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Images, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

const handleSignOut = async () => {
  try {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    window.location.href = '/login'
  } catch (error) {
    window.location.href = '/login'
  }
}

export default function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/service',
      label: 'Services',
      icon: Wrench,
    },
    {
      href: '/images', 
      label: 'Our Work',
      icon: Images,
    }
  ]

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-8">
            <Link href="/service" className="text-xl font-bold text-gray-900">
              Admin Panel
            </Link>
            
            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-blue-100 text-blue-700" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Sign Out */}
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}

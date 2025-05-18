"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, Menu, X, Sun, Moon, LayoutDashboard, Home } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  
  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), [])
  
  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GrocerySaver</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/" passHref>
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'}
                className="flex items-center"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button 
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                className="flex items-center"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
          </nav>
          
          <div className="flex md:hidden">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="mr-2"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden"
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link href="/" passHref>
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={closeMenu}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button 
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={closeMenu}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}
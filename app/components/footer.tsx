import Link from 'next/link'
import { ShoppingCart, Github, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GrocerySaver</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Compare grocery prices across multiple platforms and save money on your shopping in Bangalore.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/lists/new" className="text-muted-foreground hover:text-foreground transition-colors">
                  Create Shopping List
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:support@grocerysaver.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  support@grocerysaver.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Github className="h-4 w-4 text-muted-foreground" />
                <a href="https://github.com/grocerysaver" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GrocerySaver. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            Made with ❤️ in Bangalore, India
          </p>
        </div>
      </div>
    </footer>
  )
}
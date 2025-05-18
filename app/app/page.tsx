import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  TrendingDown, 
  Zap, 
  BarChart4, 
  ShoppingBag, 
  ArrowRight,
  Check
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden hero-gradient">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Save Money on Your <span className="text-primary">Grocery Shopping</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Compare prices across multiple e-commerce platforms in Bangalore and find the best deals for your grocery list.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard/lists/new">
                    Create Shopping List
                    <ShoppingCart className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://joyofandroid.com/wp-content/uploads/2019/09/best-grocery-store-price-comparison-apps-android.png"
                alt="Grocery price comparison app"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How GrocerySaver Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform helps you find the best deals on groceries by comparing prices across multiple e-commerce platforms.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Create Shopping List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Add all the grocery items you need to your shopping list. We'll fetch real-time prices for each item.</p>
              </CardContent>
            </Card>
            
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-primary" />
                  Compare Prices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>See price comparisons across Amazon, BigBasket, Blinkit, JioMart and other platforms in real-time.</p>
              </CardContent>
            </Card>
            
            <Card className="feature-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  Optimize Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our algorithm suggests the optimal way to split your shopping across platforms to maximize your savings.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
              <Image
                src="https://i.pinimg.com/originals/03/5a/86/035a86acf65b5097c84e750f738321ec.png"
                alt="Save money on groceries"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose GrocerySaver?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Save Money</h3>
                    <p className="text-muted-foreground">Users save an average of 15-20% on their grocery bills by splitting purchases across platforms.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Real-Time Prices</h3>
                    <p className="text-muted-foreground">Get up-to-date pricing information from all major grocery delivery platforms in Bangalore.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Smart Optimization</h3>
                    <p className="text-muted-foreground">Our algorithm considers delivery fees and minimum order values to truly maximize your savings.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">No Login Required</h3>
                    <p className="text-muted-foreground">Start comparing prices immediately without creating an account or sharing personal information.</p>
                  </div>
                </li>
              </ul>
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Start Saving Now
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supported Platforms</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We compare prices across these major grocery delivery platforms in Bangalore.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="flex items-center justify-center p-6 h-32">
              <div className="text-center">
                <h3 className="font-bold text-xl">Amazon</h3>
                <p className="text-sm text-muted-foreground">Fresh & Pantry</p>
              </div>
            </Card>
            
            <Card className="flex items-center justify-center p-6 h-32">
              <div className="text-center">
                <h3 className="font-bold text-xl">BigBasket</h3>
                <p className="text-sm text-muted-foreground">Grocery Delivery</p>
              </div>
            </Card>
            
            <Card className="flex items-center justify-center p-6 h-32">
              <div className="text-center">
                <h3 className="font-bold text-xl">Blinkit</h3>
                <p className="text-sm text-muted-foreground">10-Minute Delivery</p>
              </div>
            </Card>
            
            <Card className="flex items-center justify-center p-6 h-32">
              <div className="text-center">
                <h3 className="font-bold text-xl">JioMart</h3>
                <p className="text-sm text-muted-foreground">Online Supermarket</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Save on Your Grocery Shopping?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start comparing prices and optimizing your grocery shopping today. No registration required!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard/lists/new">
                  Create Shopping List
                  <ShoppingBag className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
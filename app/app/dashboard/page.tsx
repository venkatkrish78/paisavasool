import Link from 'next/link'
import { ShoppingCart, Plus, TrendingDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingLists } from '@/components/shopping-lists'

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your shopping lists and compare prices</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/lists/new">
            <Plus className="mr-2 h-4 w-4" />
            New Shopping List
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
              Shopping Lists
            </CardTitle>
            <CardDescription>Create and manage your shopping lists</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Add grocery items to your lists and compare prices across platforms.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/lists/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New List
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingDown className="mr-2 h-5 w-5 text-primary" />
              Price Comparison
            </CardTitle>
            <CardDescription>Compare prices across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <p>See real-time prices from Amazon, BigBasket, Blinkit, and JioMart.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">
              Select a list to compare
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
              Bangalore Delivery
            </CardTitle>
            <CardDescription>Optimized for Bangalore</CardDescription>
          </CardHeader>
          <CardContent>
            <p>All price comparisons and delivery options are specific to Bangalore.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">
              Location: Bangalore
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <ShoppingLists />
    </div>
  )
}
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShoppingCart, Plus, ArrowLeft, BarChart4 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ShoppingListItems } from '@/components/shopping-list-items'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

interface ShoppingListPageProps {
  params: {
    id: string
  }
}

export default async function ShoppingListPage({ params }: ShoppingListPageProps) {
  const { id } = params
  
  const shoppingList = await prisma.shoppingList.findUnique({
    where: {
      id,
    },
  })
  
  if (!shoppingList) {
    notFound()
  }
  
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6 text-primary" />
            {shoppingList.name}
          </h1>
          <p className="text-muted-foreground">
            Created on {new Date(shoppingList.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/lists/${id}/add-item`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/lists/${id}/compare`}>
              <BarChart4 className="mr-2 h-4 w-4" />
              Compare Prices
            </Link>
          </Button>
        </div>
      </div>
      
      <ShoppingListItems listId={id} />
    </div>
  )
}
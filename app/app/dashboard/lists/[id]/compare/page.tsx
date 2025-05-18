import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BarChart4 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PriceComparison } from '@/components/price-comparison'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

interface ComparePageProps {
  params: {
    id: string
  }
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { id } = params
  
  try {
    // Fetch the shopping list to verify it exists
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
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/lists/${id}`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to List
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart4 className="mr-2 h-6 w-6 text-primary" />
            Price Comparison: {shoppingList.name}
          </h1>
          <p className="text-muted-foreground">Compare prices across platforms and optimize your shopping</p>
        </div>
        
        <PriceComparison listId={id} />
      </div>
    )
  } catch (error) {
    console.error("Error in ComparePage:", error);
    // Return a fallback UI instead of throwing an error
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Error Loading Comparison</h1>
          <p className="text-muted-foreground">We encountered an error while loading the price comparison. Please try again later.</p>
        </div>
      </div>
    )
  }
}
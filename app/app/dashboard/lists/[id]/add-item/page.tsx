import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ItemForm } from '@/components/item-form'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

interface AddItemPageProps {
  params: {
    id: string
  }
}

export default async function AddItemPage({ params }: AddItemPageProps) {
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
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/lists/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to List
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Add Item to {shoppingList.name}</h1>
        <p className="text-muted-foreground">Add grocery items to your shopping list</p>
      </div>
      
      <div className="max-w-2xl">
        <ItemForm listId={id} />
      </div>
    </div>
  )
}
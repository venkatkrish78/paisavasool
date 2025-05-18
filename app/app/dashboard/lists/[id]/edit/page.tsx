import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { EditShoppingListForm } from '@/components/edit-shopping-list-form'

export const dynamic = "force-dynamic";

interface EditShoppingListPageProps {
  params: {
    id: string
  }
}

export default async function EditShoppingListPage({ params }: EditShoppingListPageProps) {
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
        <h1 className="text-3xl font-bold flex items-center">
          <Edit className="mr-2 h-6 w-6 text-primary" />
          Edit Shopping List
        </h1>
        <p className="text-muted-foreground">Update your shopping list details</p>
      </div>
      
      <div className="max-w-2xl">
        <EditShoppingListForm id={id} name={shoppingList.name} />
      </div>
    </div>
  )
}
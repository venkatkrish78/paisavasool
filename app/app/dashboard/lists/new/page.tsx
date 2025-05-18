import { ShoppingListForm } from '@/components/shopping-list-form'

export default function NewShoppingListPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Shopping List</h1>
        <p className="text-muted-foreground">Add a new shopping list to compare prices</p>
      </div>
      
      <ShoppingListForm />
    </div>
  )
}
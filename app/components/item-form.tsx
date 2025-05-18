"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/components/ui/use-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface ItemFormProps {
  listId: string
}

export function ItemForm({ listId }: ItemFormProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the item",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/shopping-lists/${listId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          quantity,
          unit,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add item')
      }
      
      toast({
        title: "Success!",
        description: "Item added to your shopping list.",
      })
      
      setName('')
      setQuantity(1)
      setUnit('')
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Add New Item
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="name"
                  placeholder="Item name (e.g., Rice, Milk, Apples)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col space-y-1.5 w-1/3">
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col space-y-1.5 w-2/3">
                  <Input
                    id="unit"
                    placeholder="Unit (e.g., kg, pcs, liters)"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
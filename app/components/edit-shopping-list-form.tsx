"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/components/ui/use-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface EditShoppingListFormProps {
  id: string
  name: string
}

export function EditShoppingListForm({ id, name }: EditShoppingListFormProps) {
  const [listName, setListName] = useState(name)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!listName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your shopping list",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/shopping-lists/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: listName,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update shopping list')
      }
      
      toast({
        title: "Success!",
        description: "Your shopping list has been updated.",
      })
      
      router.push(`/dashboard/lists/${id}`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update shopping list. Please try again.",
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Edit Shopping List
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="name"
                  placeholder="Enter shopping list name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
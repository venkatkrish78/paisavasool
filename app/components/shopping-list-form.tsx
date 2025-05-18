"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/components/ui/use-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface ShoppingListFormProps {
  userId?: string
}

export function ShoppingListForm({ userId }: ShoppingListFormProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your shopping list",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/shopping-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          userId,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create shopping list')
      }
      
      const data = await response.json()
      
      toast({
        title: "Success!",
        description: "Your shopping list has been created.",
      })
      
      router.push(`/dashboard/lists/${data.id}`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shopping list. Please try again.",
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
            Create New Shopping List
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="name"
                  placeholder="Enter shopping list name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
              <Plus className="mr-2 h-4 w-4" />
              {isLoading ? "Creating..." : "Create Shopping List"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
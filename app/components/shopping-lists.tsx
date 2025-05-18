"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, Trash2, Edit, Plus, ExternalLink } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useToast } from '@/components/ui/use-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ShoppingList {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  items: any[]
}

export function ShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch('/api/shopping-lists')
        
        if (!response.ok) {
          throw new Error('Failed to fetch shopping lists')
        }
        
        const data = await response.json()
        setLists(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load shopping lists. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchLists()
  }, [toast])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shopping list?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/shopping-lists/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete shopping list')
      }
      
      setLists(lists.filter(list => list.id !== id))
      
      toast({
        title: "Success",
        description: "Shopping list deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shopping list",
        variant: "destructive",
      })
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Shopping Lists</h2>
        <Button onClick={() => router.push('/dashboard/lists/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New List
        </Button>
      </div>

      {lists.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="mb-4">You don't have any shopping lists yet.</p>
            <Button onClick={() => router.push('/dashboard/lists/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First List
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {lists.map((list) => (
            <motion.div key={list.id} variants={item}>
              <Card className="h-full flex flex-col hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                      <span className="truncate">{list.name}</span>
                    </div>
                    <Badge variant="secondary">
                      {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(list.createdAt).toLocaleDateString()}
                  </p>
                  {list.items.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Items:</p>
                      <ul className="text-sm space-y-1">
                        {list.items.slice(0, 3).map((item) => (
                          <li key={item.id} className="truncate">{item.name}</li>
                        ))}
                        {list.items.length > 3 && (
                          <li className="text-muted-foreground">+ {list.items.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">No items added yet</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(list.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/dashboard/lists/${list.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      asChild
                    >
                      <Link href={`/dashboard/lists/${list.id}`}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
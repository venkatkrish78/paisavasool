"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, Trash2, RefreshCw, ShoppingCart, ExternalLink, Plus } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useToast } from '@/components/ui/use-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string | null
  prices: ItemPrice[]
}

interface ItemPrice {
  id: string
  platform: string
  price: number
  url: string | null
  available: boolean
  productName: string | null
  imageUrl: string | null
}

interface ShoppingListItemsProps {
  listId: string
}

export function ShoppingListItems({ listId }: ShoppingListItemsProps) {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/shopping-lists/${listId}/items`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch items')
      }
      
      const data = await response.json()
      setItems(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load items. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [listId, toast])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/shopping-lists/${listId}/items/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete item')
      }
      
      setItems(items.filter(item => item.id !== id))
      
      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const refreshPrices = async () => {
    setIsRefreshing(true)
    
    try {
      const response = await fetch(`/api/shopping-lists/${listId}/refresh-prices`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to refresh prices')
      }
      
      await fetchItems()
      
      toast({
        title: "Success",
        description: "Prices refreshed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh prices",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
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

  const getLowestPrice = (prices: ItemPrice[]) => {
    if (!prices || prices.length === 0) return null;
    
    const availablePrices = prices.filter(price => price.available);
    if (availablePrices.length === 0) return null;
    
    return availablePrices.reduce((lowest, current) => 
      current.price < lowest.price ? current : lowest, availablePrices[0]);
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
        <h2 className="text-2xl font-bold flex items-center">
          <Package className="mr-2 h-6 w-6 text-primary" />
          Shopping List Items
        </h2>
        <Button 
          onClick={refreshPrices} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Prices'}
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="mb-4">No items in this shopping list yet.</p>
            <Button onClick={() => router.push(`/dashboard/lists/${listId}/add-item`)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                  <span>Items ({items.length})</span>
                </div>
                <Button 
                  size="sm"
                  onClick={() => router.push(`/dashboard/lists/${listId}/compare`)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Compare & Optimize
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Best Price</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => {
                    const lowestPrice = getLowestPrice(item.prices);
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unit && <span className="text-muted-foreground">{item.unit}</span>}
                        </TableCell>
                        <TableCell>
                          {lowestPrice ? (
                            <span className="font-medium">
                              ₹{lowestPrice.price.toFixed(2)}
                            </span>
                          ) : (
                            <Badge variant="outline">No price data</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {lowestPrice ? (
                            <Badge>{lowestPrice.platform}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
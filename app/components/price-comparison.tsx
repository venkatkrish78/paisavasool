"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ShoppingCart, 
  TrendingDown, 
  ExternalLink, 
  Check, 
  X, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { formatCurrency, optimizeShoppingList } from '@/lib/utils'

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

interface PlatformInfo {
  id: string
  name: string
  logoUrl: string | null
  deliveryFee: number
  minOrderValue: number
  deliveryTime: string | null
}

interface PriceComparisonProps {
  listId: string
}

export function PriceComparison({ listId }: PriceComparisonProps) {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [platforms, setPlatforms] = useState<PlatformInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch items
        const itemsResponse = await fetch(`/api/shopping-lists/${listId}/items`)
        
        if (!itemsResponse.ok) {
          throw new Error('Failed to fetch items')
        }
        
        const itemsData = await itemsResponse.json()
        setItems(itemsData)
        
        // Fetch platform info
        const platformsResponse = await fetch('/api/platforms')
        
        if (!platformsResponse.ok) {
          throw new Error('Failed to fetch platform information')
        }
        
        const platformsData = await platformsResponse.json()
        setPlatforms(platformsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [listId, toast])

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

  // Calculate total cost for each platform
  const calculatePlatformTotals = () => {
    const platformTotals: Record<string, number> = {};
    const platformItems: Record<string, ShoppingItem[]> = {};
    
    // Initialize with all platforms
    platforms.forEach(platform => {
      platformTotals[platform.name] = 0;
      platformItems[platform.name] = [];
    });
    
    // Calculate totals
    items.forEach(item => {
      item.prices.forEach(price => {
        if (price.available) {
          const totalItemPrice = price.price * item.quantity;
          platformTotals[price.platform] += totalItemPrice;
          
          // Add item to platform items
          if (!platformItems[price.platform].find(i => i.id === item.id)) {
            platformItems[price.platform].push({
              ...item,
              prices: [price]
            });
          }
        }
      });
    });
    
    // Add delivery fees
    platforms.forEach(platform => {
      if (platformTotals[platform.name] > 0 && platformTotals[platform.name] >= platform.minOrderValue) {
        platformTotals[platform.name] += platform.deliveryFee;
      }
    });
    
    return { platformTotals, platformItems };
  };

  const { platformTotals, platformItems } = calculatePlatformTotals();
  
  // Find the cheapest platform
  const cheapestPlatform = Object.entries(platformTotals)
    .filter(([_, total]) => total > 0)
    .sort(([_, totalA], [__, totalB]) => totalA - totalB)[0]?.[0] || null;
  
  // Calculate optimized shopping
  const optimized = optimizeShoppingList(items);
  
  // Calculate total with delivery fees
  let optimizedTotalWithDelivery = optimized.totalCost;
  Object.keys(optimized.platformItems).forEach(platform => {
    const platformInfo = platforms.find(p => p.name === platform);
    if (platformInfo) {
      const platformTotal = optimized.platformItems[platform].reduce(
        (sum, item) => sum + (item.bestPrice.price * item.quantity), 0
      );
      
      if (platformTotal >= platformInfo.minOrderValue) {
        optimizedTotalWithDelivery += platformInfo.deliveryFee;
      }
    }
  });
  
  // Calculate savings compared to cheapest single platform
  const cheapestPlatformTotal = cheapestPlatform ? platformTotals[cheapestPlatform] : 0;
  const savings = cheapestPlatformTotal > 0 ? cheapestPlatformTotal - optimizedTotalWithDelivery : 0;
  const savingsPercentage = cheapestPlatformTotal > 0 ? Math.round((savings / cheapestPlatformTotal) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="pt-6 text-center">
          <p className="mb-4">No items in this shopping list yet.</p>
          <Button asChild>
            <Link href={`/dashboard/lists/${listId}`}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Go Back to Shopping List
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div 
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="space-y-8"
    >
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <TrendingDown className="mr-2 h-6 w-6 text-primary" />
              Price Comparison Summary
            </CardTitle>
            <CardDescription>
              Compare prices across platforms and find the best deals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white/50 dark:bg-gray-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{items.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/50 dark:bg-gray-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Best Single Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  {cheapestPlatform ? (
                    <div>
                      <div className="text-xl font-bold">{cheapestPlatform}</div>
                      <div className="text-lg">{formatCurrency(platformTotals[cheapestPlatform])}</div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No data available</div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 dark:bg-green-900/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4 text-green-600" />
                    Optimized Shopping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(optimizedTotalWithDelivery)}
                  </div>
                  {savings > 0 && (
                    <div className="flex items-center mt-1">
                      <Badge variant="success" className="mr-2">Save {savingsPercentage}%</Badge>
                      <span className="text-sm text-green-600">{formatCurrency(savings)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="optimized">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="optimized">Optimized Shopping</TabsTrigger>
            <TabsTrigger value="comparison">Platform Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="optimized" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                  Optimized Shopping Plan
                </CardTitle>
                <CardDescription>
                  Split your shopping across these platforms to save money
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(optimized.platformItems).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(optimized.platformItems).map(([platform, platformItems]) => {
                      const platformInfo = platforms.find(p => p.name === platform);
                      const platformTotal = platformItems.reduce(
                        (sum, item) => sum + (item.bestPrice.price * item.quantity), 0
                      );
                      
                      return (
                        <div key={platform} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Badge className="mr-2">{platform}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {platformItems.length} {platformItems.length === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(platformTotal)}</div>
                              {platformInfo && (
                                <div className="text-xs text-muted-foreground">
                                  + {formatCurrency(platformInfo.deliveryFee)} delivery
                                  {platformInfo.minOrderValue > 0 && (
                                    <span>
                                      {platformTotal < platformInfo.minOrderValue ? 
                                        ` (min order: ${formatCurrency(platformInfo.minOrderValue)})` : 
                                        ''}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {platformItems.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.name}</TableCell>
                                  <TableCell>
                                    {item.quantity} {item.unit && <span className="text-muted-foreground">{item.unit}</span>}
                                  </TableCell>
                                  <TableCell>{formatCurrency(item.bestPrice.price)}</TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency(item.bestPrice.price * item.quantity)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(platformTotal)}</TableCell>
                              </TableRow>
                              {platformInfo && (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-right font-medium">Delivery Fee</TableCell>
                                  <TableCell className="text-right font-medium">{formatCurrency(platformInfo.deliveryFee)}</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                          
                          <div className="flex justify-end">
                            <Button asChild>
                              <Link href={platformItems[0]?.bestPrice?.url || '#'} target="_blank" rel="noopener noreferrer">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Shop on {platform}
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    
                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold text-green-700">Total Savings</h3>
                            <p className="text-sm text-green-600">Compared to best single platform</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(savings)}</div>
                            <Badge variant="success">{savingsPercentage}% cheaper</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No price data available for optimization
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
                  Platform Price Comparison
                </CardTitle>
                <CardDescription>
                  Compare prices for each item across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      {platforms.map(platform => (
                        <TableHead key={platform.id}>{platform.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unit && <span className="text-muted-foreground">{item.unit}</span>}
                        </TableCell>
                        
                        {platforms.map(platform => {
                          const price = item.prices.find(p => p.platform === platform.name);
                          
                          return (
                            <TableCell key={platform.id}>
                              {price ? (
                                <div>
                                  {price.available ? (
                                    <div className="flex flex-col">
                                      <span className="font-medium">{formatCurrency(price.price)}</span>
                                      {price.url && (
                                        <Link 
                                          href={price.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                                        >
                                          View <ExternalLink className="ml-1 h-3 w-3" />
                                        </Link>
                                      )}
                                    </div>
                                  ) : (
                                    <Badge variant="outline" className="text-muted-foreground">
                                      Not available
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                    
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={2} className="font-bold">
                        Platform Totals
                      </TableCell>
                      {platforms.map(platform => (
                        <TableCell key={platform.id} className="font-bold">
                          {platformTotals[platform.name] > 0 ? 
                            formatCurrency(platformTotals[platform.name]) : 
                            <span className="text-muted-foreground">-</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={2} className="font-medium text-muted-foreground">
                        Items Available
                      </TableCell>
                      {platforms.map(platform => {
                        const availableItems = items.filter(item => 
                          item.prices.some(price => price.platform === platform.name && price.available)
                        ).length;
                        
                        return (
                          <TableCell key={platform.id}>
                            {availableItems > 0 ? (
                              <Badge variant={availableItems === items.length ? "success" : "warning"}>
                                {availableItems}/{items.length}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">0/{items.length}</Badge>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={2} className="font-medium text-muted-foreground">
                        Delivery Fee
                      </TableCell>
                      {platforms.map(platform => (
                        <TableCell key={platform.id}>
                          {formatCurrency(platform.deliveryFee)}
                        </TableCell>
                      ))}
                    </TableRow>
                    
                    <TableRow>
                      <TableCell colSpan={2} className="font-medium text-muted-foreground">
                        Min Order Value
                      </TableCell>
                      {platforms.map(platform => (
                        <TableCell key={platform.id}>
                          {platform.minOrderValue > 0 ? 
                            formatCurrency(platform.minOrderValue) : 
                            <span className="text-muted-foreground">None</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  * Prices include delivery fees where applicable
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">Best Value:</span>
                  <Badge variant="success" className="flex items-center">
                    Optimized Shopping
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
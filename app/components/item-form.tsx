"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Package, Search, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/use-toast'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'

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
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  
  const router = useRouter()
  const { toast } = useToast()
  const suggestionRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Close suggestions when clicking outside
  useOnClickOutside(suggestionRef, () => setShowSuggestions(false))

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!name || name.length < 2) {
        setSuggestions([])
        return
      }
      
      setIsFetchingSuggestions(true)
      
      try {
        const response = await fetch(`/api/grocery-suggestions?query=${encodeURIComponent(name)}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions')
        }
        
        const data = await response.json()
        setSuggestions(data)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsFetchingSuggestions(false)
      }
    }
    
    // Debounce the API call
    const timeoutId = setTimeout(() => {
      fetchSuggestions()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [name])

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
  
  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    inputRef.current?.focus()
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle keyboard navigation for suggestions
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0)
      } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
        e.preventDefault()
        handleSuggestionClick(suggestions[selectedSuggestionIndex])
      } else if (e.key === 'Escape') {
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
    }
  }
  
  const clearInput = () => {
    setName('')
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
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
              <div className="flex flex-col space-y-1.5 relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    ref={inputRef}
                    id="name"
                    placeholder="Item name (e.g., Rice, Milk, Apples)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => name.length >= 2 && setShowSuggestions(true)}
                    disabled={isLoading}
                    className="pl-10"
                  />
                  {name && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {isFetchingSuggestions ? (
                        <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                      ) : (
                        <button 
                          type="button" 
                          onClick={clearInput}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      ref={suggestionRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      <ul className="py-1">
                        {suggestions.map((suggestion, index) => (
                          <li 
                            key={index}
                            className={`px-4 py-2 cursor-pointer hover:bg-muted text-sm ${
                              selectedSuggestionIndex === index ? 'bg-muted' : ''
                            }`}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
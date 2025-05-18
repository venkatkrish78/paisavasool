import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

// Function to generate random price data
function generateUpdatedPriceData(currentPrice: number) {
  // Generate a price change between -10% and +10%
  const changePercent = (Math.random() * 20) - 10
  const newPrice = currentPrice * (1 + (changePercent / 100))
  
  // Round to 2 decimal places
  return Math.round(newPrice * 100) / 100
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get all items in the shopping list
    const items = await prisma.shoppingItem.findMany({
      where: {
        shoppingListId: params.id,
      },
      include: {
        prices: true,
      },
    })
    
    // Update prices for each item
    for (const item of items) {
      for (const price of item.prices) {
        // Generate new price
        const newPrice = generateUpdatedPriceData(price.price)
        
        // Update the price
        await prisma.itemPrice.update({
          where: {
            id: price.id,
          },
          data: {
            price: newPrice,
            lastUpdated: new Date(),
          },
        })
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error refreshing prices:', error)
    return NextResponse.json(
      { error: 'Failed to refresh prices' },
      { status: 500 }
    )
  }
}
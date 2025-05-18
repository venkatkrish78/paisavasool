import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

// Mock data for platforms and prices
const platforms = ['Amazon', 'BigBasket', 'Blinkit', 'JioMart']

// Function to generate random price data
function generatePriceData(itemName: string) {
  const prices = []
  
  for (const platform of platforms) {
    // Generate a base price between 50 and 500
    const basePrice = Math.floor(Math.random() * 450) + 50
    
    // Add some variation per platform
    let price = basePrice
    if (platform === 'Amazon') price *= 0.95 + Math.random() * 0.2
    if (platform === 'BigBasket') price *= 0.9 + Math.random() * 0.25
    if (platform === 'Blinkit') price *= 1.05 + Math.random() * 0.15
    if (platform === 'JioMart') price *= 0.85 + Math.random() * 0.3
    
    // Round to 2 decimal places
    price = Math.round(price * 100) / 100
    
    // 90% chance the item is available
    const available = Math.random() > 0.1
    
    prices.push({
      platform,
      price,
      available,
      url: `https://example.com/${platform.toLowerCase()}/${itemName.toLowerCase().replace(/\s+/g, '-')}`,
      productName: `${platform} ${itemName}`,
    })
  }
  
  return prices
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const items = await prisma.shoppingItem.findMany({
      where: {
        shoppingListId: params.id,
      },
      include: {
        prices: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, quantity, unit } = await request.json()
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }
    
    // Create the item
    const item = await prisma.shoppingItem.create({
      data: {
        name,
        quantity: quantity || 1,
        unit: unit || null,
        shoppingListId: params.id,
      },
    })
    
    // Generate mock price data
    const priceData = generatePriceData(name)
    
    // Create price entries for each platform
    for (const price of priceData) {
      await prisma.itemPrice.create({
        data: {
          platform: price.platform,
          price: price.price,
          available: price.available,
          url: price.url,
          productName: price.productName,
          shoppingItemId: item.id,
        },
      })
    }
    
    // Fetch the item with prices
    const itemWithPrices = await prisma.shoppingItem.findUnique({
      where: {
        id: item.id,
      },
      include: {
        prices: true,
      },
    })
    
    return NextResponse.json(itemWithPrices)
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

// Mock platform data
const platformData = [
  {
    name: 'Amazon',
    logoUrl: 'https://example.com/amazon-logo.png',
    deliveryFee: 40,
    minOrderValue: 199,
    deliveryTime: '2-3 hours',
  },
  {
    name: 'BigBasket',
    logoUrl: 'https://example.com/bigbasket-logo.png',
    deliveryFee: 30,
    minOrderValue: 150,
    deliveryTime: '1-2 hours',
  },
  {
    name: 'Blinkit',
    logoUrl: 'https://example.com/blinkit-logo.png',
    deliveryFee: 20,
    minOrderValue: 99,
    deliveryTime: '10-15 mins',
  },
  {
    name: 'JioMart',
    logoUrl: 'https://example.com/jiomart-logo.png',
    deliveryFee: 35,
    minOrderValue: 250,
    deliveryTime: '2-4 hours',
  },
]

export async function GET() {
  try {
    // Check if platforms already exist
    const existingPlatforms = await prisma.platformInfo.findMany()
    
    if (existingPlatforms.length === 0) {
      // Create platforms if they don't exist
      await prisma.platformInfo.createMany({
        data: platformData,
        skipDuplicates: true,
      })
    }
    
    // Fetch all platforms
    const platforms = await prisma.platformInfo.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    
    return NextResponse.json(platforms)
  } catch (error) {
    console.error('Error fetching platforms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const shoppingLists = await prisma.shoppingList.findMany({
      include: {
        items: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    
    return NextResponse.json(shoppingLists)
  } catch (error) {
    console.error('Error fetching shopping lists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shopping lists' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, userId } = await request.json()
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }
    
    const shoppingList = await prisma.shoppingList.create({
      data: {
        name,
        userId,
      },
    })
    
    return NextResponse.json(shoppingList)
  } catch (error) {
    console.error('Error creating shopping list:', error)
    return NextResponse.json(
      { error: 'Failed to create shopping list' },
      { status: 500 }
    )
  }
}
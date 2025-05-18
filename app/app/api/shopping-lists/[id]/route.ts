import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shoppingList = await prisma.shoppingList.findUnique({
      where: {
        id: params.id,
      },
      include: {
        items: {
          include: {
            prices: true,
          },
        },
      },
    })
    
    if (!shoppingList) {
      return NextResponse.json(
        { error: 'Shopping list not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(shoppingList)
  } catch (error) {
    console.error('Error fetching shopping list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shopping list' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json()
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }
    
    const updatedShoppingList = await prisma.shoppingList.update({
      where: {
        id: params.id,
      },
      data: {
        name,
      },
    })
    
    return NextResponse.json(updatedShoppingList)
  } catch (error) {
    console.error('Error updating shopping list:', error)
    return NextResponse.json(
      { error: 'Failed to update shopping list' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.shoppingList.delete({
      where: {
        id: params.id,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting shopping list:', error)
    return NextResponse.json(
      { error: 'Failed to delete shopping list' },
      { status: 500 }
    )
  }
}
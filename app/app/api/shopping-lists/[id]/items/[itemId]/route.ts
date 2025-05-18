import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    // First check if the item exists and belongs to the specified list
    const item = await prisma.shoppingItem.findFirst({
      where: {
        id: params.itemId,
        shoppingListId: params.id,
      },
    })
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found or does not belong to this shopping list' },
        { status: 404 }
      )
    }
    
    // Delete the item (this will cascade delete the prices due to onDelete: Cascade in the schema)
    await prisma.shoppingItem.delete({
      where: {
        id: params.itemId,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
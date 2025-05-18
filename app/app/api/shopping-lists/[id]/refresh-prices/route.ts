import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

// Function to fetch real-time prices from our API with improved error handling
async function fetchRealTimePrices(itemName: string) {
  try {
    console.log(`Fetching real-time prices for item: ${itemName}`);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/real-time-prices?item=${encodeURIComponent(itemName)}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch real-time prices: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid price data received');
    }
    
    console.log(`Successfully fetched prices for ${itemName} from ${data.length} platforms`);
    return data;
  } catch (error) {
    console.error('Error fetching real-time prices:', error);
    return null;
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Refreshing prices for shopping list: ${params.id}`);
    
    // Get all items in the shopping list
    const items = await prisma.shoppingItem.findMany({
      where: {
        shoppingListId: params.id,
      },
      include: {
        prices: true,
      },
    });
    
    console.log(`Found ${items.length} items to refresh prices for`);
    
    // Update prices for each item
    let successCount = 0;
    let failureCount = 0;
    
    for (const item of items) {
      // Fetch real-time prices for this item
      const newPrices = await fetchRealTimePrices(item.name);
      
      if (newPrices && Array.isArray(newPrices) && newPrices.length > 0) {
        // Delete existing prices for this item
        await prisma.itemPrice.deleteMany({
          where: {
            shoppingItemId: item.id,
          },
        });
        
        // Create new price entries
        const priceData = newPrices.map(price => ({
          platform: price.platform,
          price: price.price,
          available: price.available,
          url: price.url,
          productName: price.productName,
          imageUrl: price.imageUrl,
          shoppingItemId: item.id,
          lastUpdated: new Date(),
        }));
        
        await prisma.itemPrice.createMany({
          data: priceData,
        });
        
        console.log(`Successfully updated prices for item: ${item.name} (${newPrices.length} platforms)`);
        successCount++;
      } else {
        console.error(`Failed to fetch new prices for item: ${item.name}`);
        
        // If fetching real-time prices failed, just update the lastUpdated timestamp
        if (item.prices && item.prices.length > 0) {
          for (const price of item.prices) {
            await prisma.itemPrice.update({
              where: {
                id: price.id,
              },
              data: {
                lastUpdated: new Date(),
              },
            });
          }
          console.log(`Updated timestamps for existing prices for item: ${item.name}`);
        }
        
        failureCount++;
      }
    }
    
    console.log(`Price refresh complete. Success: ${successCount}, Failures: ${failureCount}`);
    
    return NextResponse.json({ 
      success: true,
      summary: {
        total: items.length,
        success: successCount,
        failure: failureCount
      }
    });
  } catch (error) {
    console.error('Error refreshing prices:', error);
    return NextResponse.json(
      { error: 'Failed to refresh prices' },
      { status: 500 }
    );
  }
}
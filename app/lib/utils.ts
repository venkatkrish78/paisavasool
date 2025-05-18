import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateSavings(originalTotal: number, optimizedTotal: number): number {
  return Math.max(0, originalTotal - optimizedTotal);
}

export function calculateSavingsPercentage(originalTotal: number, optimizedTotal: number): number {
  if (originalTotal === 0) return 0;
  return Math.round((calculateSavings(originalTotal, optimizedTotal) / originalTotal) * 100);
}

export function getLowestPricePlatform(prices: any[]): string | null {
  if (!prices || prices.length === 0) return null;
  
  const availablePrices = prices.filter(price => price.available);
  if (availablePrices.length === 0) return null;
  
  const lowestPrice = availablePrices.reduce((lowest, current) => 
    current.price < lowest.price ? current : lowest, availablePrices[0]);
  
  return lowestPrice.platform;
}

export function optimizeShoppingList(items: any[]): { 
  platformItems: Record<string, any[]>,
  savings: number,
  totalCost: number,
  originalCost: number
} {
  // Default result structure
  const result = {
    platformItems: {} as Record<string, any[]>,
    savings: 0,
    totalCost: 0,
    originalCost: 0
  };

  if (!items || items.length === 0) return result;

  // Track items for each platform and calculate costs
  const platforms = new Set<string>();
  let singlePlatformCost = 0;
  
  // First pass: identify all platforms and calculate single platform cost
  items.forEach(item => {
    if (!item.prices || item.prices.length === 0) return;
    
    // Find the lowest price across all platforms for this item
    const availablePrices = item.prices.filter((price: any) => price.available);
    if (availablePrices.length === 0) return;
    
    // Add all platforms to our set
    availablePrices.forEach((price: any) => platforms.add(price.platform));
    
    // Find the lowest price for this item on any platform
    const lowestPrice = availablePrices.reduce((lowest: any, current: any) => 
      current.price < lowest.price ? current : lowest, availablePrices[0]);
    
    // Add to the optimized total cost
    result.totalCost += lowestPrice.price * item.quantity;
  });

  // Second pass: calculate the cost if everything was bought from a single platform
  Array.from(platforms).forEach(platform => {
    let platformTotal = 0;
    let itemCount = 0;
    
    items.forEach(item => {
      const platformPrice = item.prices?.find((p: any) => p.platform === platform && p.available);
      if (platformPrice) {
        platformTotal += platformPrice.price * item.quantity;
        itemCount++;
      }
    });
    
    // Only consider platforms that have all items available
    if (itemCount === items.filter(i => i.prices && i.prices.length > 0).length) {
      if (singlePlatformCost === 0 || platformTotal < singlePlatformCost) {
        singlePlatformCost = platformTotal;
      }
    }
  });

  // If we couldn't calculate a single platform cost, use the optimized total as fallback
  result.originalCost = singlePlatformCost > 0 ? singlePlatformCost : result.totalCost;
  
  // Calculate savings
  result.savings = calculateSavings(result.originalCost, result.totalCost);
  
  // Third pass: organize items by platform based on lowest price
  items.forEach(item => {
    if (!item.prices || item.prices.length === 0) return;
    
    const availablePrices = item.prices.filter((price: any) => price.available);
    if (availablePrices.length === 0) return;
    
    const lowestPrice = availablePrices.reduce((lowest: any, current: any) => 
      current.price < lowest.price ? current : lowest, availablePrices[0]);
    
    const platform = lowestPrice.platform;
    
    if (!result.platformItems[platform]) {
      result.platformItems[platform] = [];
    }
    
    result.platformItems[platform].push({
      ...item,
      bestPrice: lowestPrice
    });
  });
  
  return result;
}
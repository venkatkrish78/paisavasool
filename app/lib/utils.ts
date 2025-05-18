import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "₹0.00";
  }
  
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `₹${amount.toFixed(2)}`;
  }
}

export function calculateSavings(originalTotal: number, optimizedTotal: number): number {
  if (typeof originalTotal !== 'number' || typeof optimizedTotal !== 'number' || isNaN(originalTotal) || isNaN(optimizedTotal)) {
    return 0;
  }
  return Math.max(0, originalTotal - optimizedTotal);
}

export function calculateSavingsPercentage(originalTotal: number, optimizedTotal: number): number {
  if (typeof originalTotal !== 'number' || typeof optimizedTotal !== 'number' || originalTotal <= 0 || isNaN(originalTotal) || isNaN(optimizedTotal)) {
    return 0;
  }
  return Math.round((calculateSavings(originalTotal, optimizedTotal) / originalTotal) * 100);
}

export function getLowestPricePlatform(prices: any[]): string | null {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return null;
  }
  
  try {
    const availablePrices = prices.filter(price => price && price.available && typeof price.price === 'number');
    if (availablePrices.length === 0) return null;
    
    const lowestPrice = availablePrices.reduce((lowest, current) => {
      if (!lowest || !current) return lowest || current;
      if (!lowest.price || !current.price) return lowest.price ? lowest : current;
      return current.price < lowest.price ? current : lowest;
    }, availablePrices[0]);
    
    return lowestPrice && lowestPrice.platform ? lowestPrice.platform : null;
  } catch (error) {
    console.error("Error getting lowest price platform:", error);
    return null;
  }
}

export function optimizeShoppingList(items: any[]): { 
  platformItems: Record<string, any[]>,
  savings: number,
  totalCost: number,
  originalCost: number
} {
  console.log("Optimizing shopping list with items:", items ? items.length : 0);
  
  // Default result structure
  const result = {
    platformItems: {} as Record<string, any[]>,
    savings: 0,
    totalCost: 0,
    originalCost: 0
  };

  if (!items || !Array.isArray(items) || items.length === 0) {
    console.log("No valid items to optimize");
    return result;
  }

  try {
    // Track items for each platform and calculate costs
    const platforms = new Set<string>();
    let singlePlatformCost = 0;
    
    // First pass: identify all platforms and calculate single platform cost
    items.forEach(item => {
      if (!item || !item.prices || !Array.isArray(item.prices) || item.prices.length === 0) {
        console.log("Skipping item with no valid prices:", item?.name);
        return;
      }
      
      // Find the lowest price across all platforms for this item
      const availablePrices = item.prices.filter((price: any) => 
        price && price.available && typeof price.price === 'number' && !isNaN(price.price));
      
      if (availablePrices.length === 0) {
        console.log("No available prices for item:", item.name);
        return;
      }
      
      // Add all platforms to our set
      availablePrices.forEach((price: any) => {
        if (price && price.platform) {
          platforms.add(price.platform);
        }
      });
      
      // Find the lowest price for this item on any platform
      const lowestPrice = availablePrices.reduce((lowest: any, current: any) => {
        if (!lowest || !current) return lowest || current;
        if (typeof lowest.price !== 'number' || typeof current.price !== 'number') {
          return typeof lowest.price === 'number' ? lowest : current;
        }
        return current.price < lowest.price ? current : lowest;
      }, availablePrices[0]);
      
      // Add to the optimized total cost
      if (lowestPrice && typeof lowestPrice.price === 'number' && !isNaN(lowestPrice.price)) {
        const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 1;
        result.totalCost += lowestPrice.price * quantity;
      }
    });

    console.log("Identified platforms:", Array.from(platforms));
    console.log("Initial optimized cost:", result.totalCost);

    // Second pass: calculate the cost if everything was bought from a single platform
    Array.from(platforms).forEach(platform => {
      if (!platform) return;
      
      let platformTotal = 0;
      let itemCount = 0;
      
      items.forEach(item => {
        if (!item || !item.prices || !Array.isArray(item.prices)) return;
        
        const platformPrice = item.prices.find((p: any) => 
          p && p.platform === platform && p.available && 
          typeof p.price === 'number' && !isNaN(p.price));
        
        if (platformPrice) {
          const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 1;
          platformTotal += platformPrice.price * quantity;
          itemCount++;
        }
      });
      
      // Only consider platforms that have all items available
      const itemsWithPrices = items.filter(i => i && i.prices && Array.isArray(i.prices) && i.prices.length > 0);
      if (itemCount === itemsWithPrices.length && itemCount > 0) {
        if (singlePlatformCost === 0 || platformTotal < singlePlatformCost) {
          singlePlatformCost = platformTotal;
          console.log(`New best single platform: ${platform} with cost: ${singlePlatformCost}`);
        }
      }
    });

    // If we couldn't calculate a single platform cost, use the optimized total as fallback
    result.originalCost = singlePlatformCost > 0 ? singlePlatformCost : result.totalCost;
    
    // Calculate savings
    result.savings = calculateSavings(result.originalCost, result.totalCost);
    console.log(`Original cost: ${result.originalCost}, Optimized cost: ${result.totalCost}, Savings: ${result.savings}`);
    
    // Third pass: organize items by platform based on lowest price
    items.forEach(item => {
      if (!item || !item.prices || !Array.isArray(item.prices) || item.prices.length === 0) return;
      
      const availablePrices = item.prices.filter((price: any) => 
        price && price.available && typeof price.price === 'number' && !isNaN(price.price));
      
      if (availablePrices.length === 0) return;
      
      const lowestPrice = availablePrices.reduce((lowest: any, current: any) => {
        if (!lowest || !current) return lowest || current;
        if (typeof lowest.price !== 'number' || typeof current.price !== 'number') {
          return typeof lowest.price === 'number' ? lowest : current;
        }
        return current.price < lowest.price ? current : lowest;
      }, availablePrices[0]);
      
      if (!lowestPrice || !lowestPrice.platform) return;
      
      const platform = lowestPrice.platform;
      
      if (!result.platformItems[platform]) {
        result.platformItems[platform] = [];
      }
      
      result.platformItems[platform].push({
        ...item,
        bestPrice: lowestPrice
      });
    });
    
    console.log(`Optimized shopping across ${Object.keys(result.platformItems).length} platforms`);
    return result;
  } catch (error) {
    console.error("Error in optimizeShoppingList:", error);
    return result;
  }
}
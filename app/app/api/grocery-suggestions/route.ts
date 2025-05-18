import { NextResponse } from 'next/server'

export const dynamic = "force-dynamic";

// Mock grocery items database
// In a real application, this would be fetched from a database or external API
const groceryItems = [
  // Fruits
  "Apples", "Bananas", "Oranges", "Grapes", "Watermelon", "Pineapple", "Mango", "Papaya", "Strawberries", "Blueberries",
  "Kiwi", "Pomegranate", "Guava", "Custard Apple", "Sapota (Chikoo)", "Lychee", "Dragon Fruit", "Avocado",
  
  // Vegetables
  "Potatoes", "Onions", "Tomatoes", "Carrots", "Cucumber", "Capsicum", "Spinach", "Cabbage", "Cauliflower", "Broccoli",
  "Beans", "Peas", "Okra (Lady Finger)", "Eggplant (Brinjal)", "Bitter Gourd (Karela)", "Bottle Gourd (Lauki)", "Ridge Gourd (Turai)",
  "Pumpkin", "Sweet Potato", "Beetroot", "Radish", "Ginger", "Garlic", "Green Chillies", "Coriander Leaves", "Mint Leaves",
  "Curry Leaves", "Lemon", "Coconut", "Mushrooms",
  
  // Dairy
  "Milk", "Curd (Yogurt)", "Paneer", "Cheese", "Butter", "Ghee", "Cream", "Buttermilk", "Condensed Milk",
  
  // Grains & Pulses
  "Rice", "Wheat Flour (Atta)", "Maida (All-Purpose Flour)", "Besan (Gram Flour)", "Rava (Semolina)", "Oats",
  "Bread", "Poha (Flattened Rice)", "Moong Dal", "Toor Dal", "Chana Dal", "Urad Dal", "Masoor Dal", "Rajma (Kidney Beans)",
  "Chickpeas (Chole)", "Black Gram (Kala Chana)", "Green Gram (Moong)", "Soya Chunks",
  
  // Spices & Condiments
  "Salt", "Sugar", "Turmeric Powder", "Red Chilli Powder", "Coriander Powder", "Cumin Powder", "Garam Masala",
  "Black Pepper", "Cardamom", "Cinnamon", "Cloves", "Bay Leaves", "Mustard Seeds", "Cumin Seeds", "Fenugreek Seeds",
  "Asafoetida (Hing)", "Saffron", "Tamarind", "Vinegar", "Cooking Oil", "Mustard Oil", "Coconut Oil", "Olive Oil",
  "Ghee", "Honey", "Jaggery",
  
  // Snacks & Beverages
  "Tea", "Coffee", "Biscuits", "Cookies", "Chips", "Namkeen", "Chocolate", "Ice Cream", "Soft Drinks", "Fruit Juices",
  "Jam", "Ketchup", "Mayonnaise", "Pasta", "Noodles", "Breakfast Cereal", "Energy Drinks", "Bottled Water",
  
  // Household & Personal Care
  "Soap", "Shampoo", "Toothpaste", "Detergent", "Dish Soap", "Floor Cleaner", "Toilet Cleaner", "Room Freshener",
  "Mosquito Repellent", "Tissue Paper", "Kitchen Towels", "Garbage Bags", "Aluminum Foil", "Cling Film",
  
  // Baby Products
  "Baby Food", "Diapers", "Baby Wipes", "Baby Soap", "Baby Shampoo", "Baby Powder", "Baby Oil", "Baby Lotion",
  
  // Pet Products
  "Dog Food", "Cat Food", "Pet Treats", "Pet Shampoo", "Pet Toys"
];

export async function GET(request: Request) {
  try {
    // Get the search query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase() || '';
    
    // If query is empty or too short, return empty array
    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }
    
    // Filter grocery items based on the query
    const suggestions = groceryItems
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 10); // Limit to 10 suggestions
    
    // Add a small delay to simulate network request (remove in production)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error fetching grocery suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grocery suggestions' },
      { status: 500 }
    );
  }
}
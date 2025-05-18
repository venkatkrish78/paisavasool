import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic";

// Enhanced platform data with more accurate information and logos
const platformData = [
  {
    name: 'Amazon',
    logoUrl: 'https://m.media-amazon.com/images/G/31/AmazonFresh/2023/November/Pantry_Store_Refresh/AF_Pantry_Logo._CB574597993_.png',
    deliveryFee: 40,
    minOrderValue: 199,
    deliveryTime: '2-3 hours',
  },
  {
    name: 'BigBasket',
    logoUrl: 'https://www.bigbasket.com/media/uploads/banner_images/hp_bbstar_m_250323_01.png',
    deliveryFee: 30,
    minOrderValue: 150,
    deliveryTime: '1-2 hours',
  },
  {
    name: 'Blinkit',
    logoUrl: 'https://cdn.zeptonow.com/web-static-assets-prod/artifacts/6.22.0/images/pdp/cross-platform-sharing/zeptoLogo.png',
    deliveryFee: 20,
    minOrderValue: 99,
    deliveryTime: '10-15 mins',
  },
  {
    name: 'JioMart',
    logoUrl: 'https://www.jiomart.com/assets/ds2web/jds-icons/jiomart-logo-icon.svg',
    deliveryFee: 35,
    minOrderValue: 250,
    deliveryTime: '2-4 hours',
  },
]

export async function GET() {
  try {
    console.log("Fetching platform information");
    
    // Check if platforms already exist
    const existingPlatforms = await prisma.platformInfo.findMany();
    
    if (existingPlatforms.length === 0) {
      console.log("No platforms found, creating default platforms");
      // Create platforms if they don't exist
      await prisma.platformInfo.createMany({
        data: platformData,
        skipDuplicates: true,
      });
    } else if (existingPlatforms.length < platformData.length) {
      // If we have fewer platforms than expected, update to ensure all 4 are present
      console.log(`Found only ${existingPlatforms.length} platforms, updating to include all 4 platforms`);
      
      // Delete existing platforms to avoid conflicts
      await prisma.platformInfo.deleteMany({});
      
      // Create all platforms
      await prisma.platformInfo.createMany({
        data: platformData,
      });
    } else {
      // Update existing platforms with latest data
      console.log("Updating existing platform information");
      for (const platform of platformData) {
        await prisma.platformInfo.updateMany({
          where: { name: platform.name },
          data: platform,
        });
      }
    }
    
    // Fetch all platforms
    const platforms = await prisma.platformInfo.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    console.log(`Found ${platforms.length} platforms`);
    return NextResponse.json(platforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    );
  }
}
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const sampleListings = [
  {
    title: 'Charming 3BR Ranch with Mountain Views',
    description: 'Welcome to this beautifully maintained ranch-style home nestled in a quiet neighborhood with stunning mountain views. This 3-bedroom, 2-bathroom home features an open floor plan perfect for entertaining.',
    price: 385000,
    propertyType: 'SINGLE_FAMILY',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    yearBuilt: 2005,
    lotSize: 0.25,
    address: '123 Mountain View Drive',
    city: 'Branson',
    state: 'MO',
    zipCode: '65616',
    features: ['Hardwood Floors', 'Updated Kitchen', 'Fireplace', 'Deck/Patio', 'Fenced Yard'],
    aiDescription: 'Discover your dream home in this meticulously maintained 3-bedroom ranch that perfectly blends comfort with breathtaking natural beauty. Wake up each morning to panoramic mountain views from your private deck, where golden sunrises paint the sky in spectacular fashion.\n\nThe heart of this home is the renovated chef\'s kitchen, featuring granite countertops, stainless steel appliances, and a breakfast bar that flows seamlessly into the sun-drenched living room. Original hardwood floors add warmth and character throughout the main level.\n\nStep outside to your private backyard oasis, complete with a wraparound deck perfect for summer barbecues and a fully fenced yard for kids and pets to play safely. The established landscaping and mature trees provide natural privacy while attracting local wildlife.\n\nLocated in one of Branson\'s most desirable neighborhoods, you\'ll enjoy easy access to Table Rock Lake, world-class entertainment, and excellent schools - all while coming home to your peaceful mountain retreat.',
    aiHighlights: [
      'Panoramic mountain views from private deck',
      'Recently renovated kitchen with granite counters',
      'Original hardwood floors throughout',
      'Large fenced backyard - perfect for families',
      'Minutes from Table Rock Lake'
    ],
  },
  {
    title: 'Modern Lakefront Condo with Boat Slip',
    description: 'Stunning lakefront condo with incredible water views and included boat slip. This 2-bedroom, 2-bathroom unit has been completely updated with modern finishes.',
    price: 299000,
    propertyType: 'CONDO',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    yearBuilt: 2018,
    address: '456 Lakeside Court Unit 301',
    city: 'Branson',
    state: 'MO',
    zipCode: '65616',
    features: ['Pool', 'Central AC', 'Walk-in Closet', 'Smart Home'],
    aiDescription: 'Live the lake life in this gorgeous waterfront condo where every day feels like vacation. Floor-to-ceiling windows frame spectacular Table Rock Lake views, filling the open-concept living space with natural light from sunrise to sunset.\n\nThis thoughtfully designed 2-bedroom retreat features a gourmet kitchen with quartz countertops, soft-close cabinets, and premium appliances. The primary suite offers a spa-like bathroom with dual vanities and a walk-in shower, plus a private balcony overlooking the water.\n\nYour purchase includes a coveted boat slip - no waitlist required! The community offers resort-style amenities including an infinity pool, fitness center, and private beach access. HOA handles all exterior maintenance so you can spend your time enjoying the lake, not maintaining your property.\n\nWhether you\'re seeking a full-time residence or a vacation getaway with rental potential, this turnkey condo delivers an unmatched lifestyle at an accessible price point.',
    aiHighlights: [
      'Direct lakefront location with water views',
      'Boat slip included - ready for your watercraft',
      'Resort-style pool and amenities',
      'Modern finishes throughout - move-in ready',
      'Strong vacation rental potential'
    ],
  },
  {
    title: 'Spacious Family Home Near Top-Rated Schools',
    description: 'Perfect family home in the heart of the best school district. This 4-bedroom home offers plenty of space for growing families with a large backyard and finished basement.',
    price: 425000,
    propertyType: 'SINGLE_FAMILY',
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 2400,
    yearBuilt: 2012,
    lotSize: 0.35,
    address: '789 Oak Street',
    city: 'Springfield',
    state: 'MO',
    zipCode: '65807',
    features: ['Basement', 'Garage', 'Central AC', 'Hardwood Floors', 'Home Office'],
    aiDescription: 'Welcome to your forever home in Springfield\'s most sought-after school district! This spacious 4-bedroom residence combines family-friendly functionality with elegant design, offering over 2,400 square feet of thoughtfully planned living space.\n\nThe main level features an inviting foyer that opens to formal living and dining rooms, perfect for hosting holiday gatherings. The updated kitchen boasts a large island, walk-in pantry, and breakfast nook overlooking the professionally landscaped backyard. A dedicated home office provides the perfect work-from-home setup.\n\nUpstairs, the generous primary suite includes a spa bathroom with soaking tub and separate shower, plus a walk-in closet that rivals boutique stores. Three additional bedrooms share a well-appointed full bath, with one bedroom easily convertible to a media room or playroom.\n\nThe finished basement adds valuable living space - currently configured as a recreation room with built-in entertainment center. The large backyard features a patio, play structure, and plenty of room for summer activities.',
    aiHighlights: [
      'Top-rated school district - walk to elementary',
      'Finished basement with rec room',
      'Updated kitchen with large island',
      'Dedicated home office space',
      'Large backyard with patio'
    ],
  },
  {
    title: 'Investment Opportunity - Duplex Near Downtown',
    description: 'Great investment property! This well-maintained duplex features two 2BR/1BA units, both currently rented with long-term tenants. Strong rental history.',
    price: 275000,
    propertyType: 'MULTI_FAMILY',
    bedrooms: 4,
    bathrooms: 2,
    sqft: 1800,
    yearBuilt: 1985,
    lotSize: 0.15,
    address: '321 Commerce Street',
    city: 'Branson',
    state: 'MO',
    zipCode: '65616',
    features: ['Garage', 'Central AC', 'New Roof'],
    aiDescription: 'Savvy investors, take note! This income-producing duplex offers an exceptional opportunity to build wealth through real estate in one of Missouri\'s top tourist destinations. Located just minutes from Branson\'s famous entertainment district, this property benefits from year-round demand from both long-term residents and seasonal workers.\n\nEach unit features a practical 2-bedroom, 1-bathroom layout with separate entrances, private parking, and individual utility meters. Recent capital improvements include a new roof (2023), updated HVAC systems, and refreshed landscaping. Both units are currently occupied by reliable tenants with excellent payment histories.\n\nCurrent rents are slightly below market rate, presenting immediate upside potential. The property generates over $24,000 annually in rental income with minimal owner involvement. Numbers are available for qualified buyers during showings.\n\nWhether you\'re expanding your portfolio or making your first investment property purchase, this turnkey duplex delivers cash flow from day one.',
    aiHighlights: [
      'Both units currently rented - immediate income',
      'New roof installed 2023',
      'Separate utility meters - tenants pay own utilities',
      'Strong rental market - tourist area demand',
      'Below-market rents offer upside potential'
    ],
  },
  {
    title: 'Build Your Dream - 5 Acre Wooded Lot',
    description: 'Stunning 5-acre wooded parcel with building site already cleared. Utilities at the road, survey completed. Perfect for your custom dream home.',
    price: 89000,
    propertyType: 'LAND',
    bedrooms: 0,
    bathrooms: 0,
    lotSize: 5,
    address: 'Lot 12 Timber Ridge Road',
    city: 'Hollister',
    state: 'MO',
    zipCode: '65672',
    features: [],
    aiDescription: 'Your blank canvas awaits! This exceptional 5-acre parcel offers the rare combination of privacy, natural beauty, and convenient access that discerning home builders seek. Mature hardwoods blanket the rolling terrain, providing a stunning backdrop for your custom dream home.\n\nThe previous owner invested significantly in preparing this lot for development: a level building site has been cleared with optimal positioning for southern exposure, the driveway has been roughed in, and a recent survey clearly marks all boundaries. Electric and water utilities are available at the road, significantly reducing your development costs.\n\nThe property features a seasonal creek along the back boundary and several potential home sites that could capture either sunrise or sunset views. Wildlife is abundant - deer, turkey, and various songbirds call this land home.\n\nLocated in a quiet, established neighborhood of quality custom homes, you\'ll enjoy the serenity of country living while remaining just 15 minutes from Branson\'s shopping, dining, and entertainment. No HOA restrictions allow you to build your vision without unnecessary limitations.',
    aiHighlights: [
      'Building site already cleared and graded',
      'Utilities available at road',
      'Recent survey completed - boundaries marked',
      'Seasonal creek and abundant wildlife',
      'No HOA - build your vision freely'
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123456', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@homebase.ai' },
    update: {},
    create: {
      email: 'demo@homebase.ai',
      name: 'Demo User',
      password: hashedPassword,
    },
  });
  
  console.log(`✅ Created demo user: ${user.email}`);

  // Create sample listings
  for (const listingData of sampleListings) {
    const slug = `${listingData.address.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).slice(-6)}`;
    
    const listing = await prisma.listing.upsert({
      where: { slug },
      update: {},
      create: {
        ...listingData,
        slug,
        status: 'ACTIVE',
        userId: user.id,
        publishedAt: new Date(),
        amenities: [],
        views: Math.floor(Math.random() * 500) + 50,
        saves: Math.floor(Math.random() * 20) + 5,
      },
    });

    // Create placeholder image
    await prisma.listingImage.upsert({
      where: { id: `${listing.id}-primary` },
      update: {},
      create: {
        id: `${listing.id}-primary`,
        listingId: listing.id,
        url: `/api/placeholder-image?name=${encodeURIComponent(listingData.title)}&w=800&h=600`,
        isPrimary: true,
        order: 0,
      },
    });

    console.log(`✅ Created listing: ${listing.title}`);
  }

  // Create sample neighborhood
  const neighborhood = await prisma.neighborhood.upsert({
    where: { slug: 'downtown-branson' },
    update: {},
    create: {
      slug: 'downtown-branson',
      name: 'Downtown Branson',
      city: 'Branson',
      state: 'MO',
      zipCodes: ['65616'],
      description: 'Downtown Branson is the heart of this vibrant entertainment destination, offering a unique blend of historic charm and modern attractions. Residents enjoy walkable access to theaters, restaurants, and shopping along the famous Strip.',
      highlights: [
        'Walking distance to entertainment district',
        'Historic downtown character',
        'Strong tourism-driven economy',
        'Year-round events and festivals',
        'Easy access to Table Rock Lake'
      ],
      walkScore: 72,
      transitScore: 35,
      bikeScore: 45,
      schoolRating: 'Good',
      crimeRating: 'Low',
      medianPrice: 285000,
      avgPricePerSqft: 165,
      daysOnMarket: 28,
      listingsCount: 5,
    },
  });

  console.log(`✅ Created neighborhood: ${neighborhood.name}`);

  console.log('\n✨ Seeding complete!\n');
  console.log('Demo credentials:');
  console.log('  Email: demo@homebase.ai');
  console.log('  Password: demo123456\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

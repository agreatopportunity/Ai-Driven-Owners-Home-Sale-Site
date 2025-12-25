import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || 'https://homebase.ai';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/list-your-home`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/home-value`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculators/mortgage`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic listing pages
  let listingPages: MetadataRoute.Sitemap = [];
  try {
    const listings = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      select: { slug: true, updatedAt: true },
    });

    listingPages = listings.map((listing) => ({
      url: `${baseUrl}/listing/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching listings for sitemap:', error);
  }

  // Dynamic neighborhood pages
  let neighborhoodPages: MetadataRoute.Sitemap = [];
  try {
    const neighborhoods = await prisma.neighborhood.findMany({
      select: { slug: true, city: true, state: true, updatedAt: true },
    });

    neighborhoodPages = neighborhoods.map((n) => ({
      url: `${baseUrl}/neighborhood/${n.state.toLowerCase()}/${n.city.toLowerCase().replace(/\s+/g, '-')}/${n.slug}`,
      lastModified: n.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching neighborhoods for sitemap:', error);
  }

  // City listing pages (aggregate by city)
  let cityPages: MetadataRoute.Sitemap = [];
  try {
    const cities = await prisma.listing.groupBy({
      by: ['city', 'state'],
      where: { status: 'ACTIVE' },
    });

    cityPages = cities.map((c) => ({
      url: `${baseUrl}/listings?city=${encodeURIComponent(c.city)}&state=${c.state}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching cities for sitemap:', error);
  }

  return [...staticPages, ...listingPages, ...neighborhoodPages, ...cityPages];
}

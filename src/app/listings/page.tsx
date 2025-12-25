import { Suspense } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { ListingCard } from '@/components/listings/ListingCard';
import { prisma } from '@/lib/prisma';

interface SearchParams {
  page?: string;
  city?: string;
  state?: string;
  minPrice?: string;
  maxPrice?: string;
  propertyType?: string;
  bedrooms?: string;
}

async function getListings(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1');
  const limit = 12;

  const where: any = {
    status: 'ACTIVE',
  };

  if (searchParams.city) {
    where.city = { contains: searchParams.city, mode: 'insensitive' };
  }
  if (searchParams.state) {
    where.state = searchParams.state.toUpperCase();
  }
  if (searchParams.minPrice) {
    where.price = { ...where.price, gte: parseInt(searchParams.minPrice) };
  }
  if (searchParams.maxPrice) {
    where.price = { ...where.price, lte: parseInt(searchParams.maxPrice) };
  }
  if (searchParams.propertyType) {
    where.propertyType = searchParams.propertyType;
  }
  if (searchParams.bedrooms) {
    where.bedrooms = { gte: parseInt(searchParams.bedrooms) };
  }

  try {
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch {
    return {
      listings: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    };
  }
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { listings, pagination } = await getListings(searchParams);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero/Search Section */}
      <section className="bg-white border-b border-cream-200 py-8">
        <div className="container-wide">
          <h1 className="text-3xl font-display font-semibold text-brand-900 mb-6">
            Homes For Sale By Owner
          </h1>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
              <input
                type="text"
                placeholder="Search by city, state, or ZIP code"
                className="input pl-12"
                defaultValue={searchParams.city || ''}
              />
            </div>
            <button className="btn-secondary">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <button className="btn-primary">Search</button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['All', 'Single Family', 'Condo', 'Townhouse', 'Land'].map(
              (type) => (
                <Link
                  key={type}
                  href={
                    type === 'All'
                      ? '/listings'
                      : `/listings?propertyType=${type.toUpperCase().replace(' ', '_')}`
                  }
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    (!searchParams.propertyType && type === 'All') ||
                    searchParams.propertyType === type.toUpperCase().replace(' ', '_')
                      ? 'bg-brand-600 text-white'
                      : 'bg-cream-100 text-brand-700 hover:bg-cream-200'
                  }`}
                >
                  {type}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container-wide">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-brand-600">
              {pagination.total === 0 ? (
                'No homes found'
              ) : (
                <>
                  <span className="font-semibold text-brand-900">
                    {pagination.total}
                  </span>{' '}
                  homes for sale
                  {searchParams.city && (
                    <span className="ml-1">
                      in{' '}
                      <span className="font-medium">{searchParams.city}</span>
                    </span>
                  )}
                </>
              )}
            </p>
            <select className="input w-auto py-2">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Bedrooms</option>
            </select>
          </div>

          {/* Listings Grid */}
          {listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-cream-300 mx-auto mb-4" />
              <h2 className="text-xl font-display font-semibold text-brand-900 mb-2">
                No listings found
              </h2>
              <p className="text-brand-600 mb-6">
                Try adjusting your search or filters
              </p>
              <Link href="/list-your-home" className="btn-primary">
                Be the first to list in this area
              </Link>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {pagination.page > 1 && (
                <Link
                  href={`/listings?page=${pagination.page - 1}`}
                  className="btn-secondary"
                >
                  Previous
                </Link>
              )}
              <span className="px-4 py-2 text-brand-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages && (
                <Link
                  href={`/listings?page=${pagination.page + 1}`}
                  className="btn-secondary"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-white border-t border-cream-200">
        <div className="container-narrow text-center">
          <h2 className="text-2xl font-display font-semibold text-brand-900 mb-4">
            Find Your Perfect Home Without Agent Fees
          </h2>
          <p className="text-brand-600 max-w-2xl mx-auto">
            Browse FSBO (For Sale By Owner) listings from homeowners selling
            directly. No 6% commission means better prices for buyers and more
            money for sellers. Every listing includes AI-enhanced photos and
            descriptions to help you find exactly what you're looking for.
          </p>
        </div>
      </section>
    </div>
  );
}

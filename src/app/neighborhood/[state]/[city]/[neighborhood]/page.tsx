import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  Home, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Shield,
  TreePine,
  Car,
  ArrowRight
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ListingCard } from '@/components/listings/ListingCard';
import { formatPrice, formatNumber, getStateName } from '@/lib/utils';

interface Props {
  params: { state: string; city: string; neighborhood: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, neighborhood } = params;
  const cityName = decodeURIComponent(city).replace(/-/g, ' ');
  const neighborhoodName = decodeURIComponent(neighborhood).replace(/-/g, ' ');
  const stateName = getStateName(state.toUpperCase());

  return {
    title: `Homes for Sale in ${neighborhoodName}, ${cityName}, ${stateName} | FSBO Listings`,
    description: `Browse for sale by owner homes in ${neighborhoodName}, ${cityName}. Find FSBO listings, neighborhood info, schools, and market data. No agent fees.`,
    openGraph: {
      title: `${neighborhoodName} Homes for Sale | ${cityName}, ${stateName}`,
      description: `Discover FSBO homes in ${neighborhoodName}. View listings, neighborhood stats, and local insights.`,
    },
  };
}

async function getNeighborhoodData(state: string, city: string, neighborhood: string) {
  const cityName = decodeURIComponent(city).replace(/-/g, ' ');
  const neighborhoodName = decodeURIComponent(neighborhood).replace(/-/g, ' ');

  // Try to find existing neighborhood data
  let neighborhoodData = await prisma.neighborhood.findFirst({
    where: {
      city: { contains: cityName, mode: 'insensitive' },
      state: state.toUpperCase(),
      name: { contains: neighborhoodName, mode: 'insensitive' },
    },
  });

  // Get listings in this area
  const listings = await prisma.listing.findMany({
    where: {
      status: 'ACTIVE',
      city: { contains: cityName, mode: 'insensitive' },
      state: state.toUpperCase(),
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  // Calculate market stats from listings
  const prices = listings.map((l) => l.price);
  const medianPrice = prices.length > 0 
    ? prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)] 
    : null;
  
  const sqftPrices = listings
    .filter((l) => l.sqft && l.sqft > 0)
    .map((l) => l.price / l.sqft!);
  const avgPricePerSqft = sqftPrices.length > 0
    ? Math.round(sqftPrices.reduce((a, b) => a + b, 0) / sqftPrices.length)
    : null;

  return {
    neighborhood: neighborhoodData,
    listings,
    stats: {
      medianPrice,
      avgPricePerSqft,
      listingsCount: listings.length,
    },
    cityName,
    neighborhoodName,
    stateName: getStateName(state.toUpperCase()),
    stateAbbr: state.toUpperCase(),
  };
}

export default async function NeighborhoodPage({ params }: Props) {
  const data = await getNeighborhoodData(params.state, params.city, params.neighborhood);
  const { neighborhood, listings, stats, cityName, neighborhoodName, stateName, stateAbbr } = data;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-white border-b border-cream-200 py-12">
        <div className="container-wide">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-brand-500 mb-6">
            <Link href="/neighborhoods" className="hover:text-brand-700">Neighborhoods</Link>
            <span>/</span>
            <Link href={`/neighborhoods/${params.state}`} className="hover:text-brand-700">{stateName}</Link>
            <span>/</span>
            <Link href={`/neighborhoods/${params.state}/${params.city}`} className="hover:text-brand-700">{cityName}</Link>
            <span>/</span>
            <span className="text-brand-700">{neighborhoodName}</span>
          </nav>

          <div className="flex items-start justify-between gap-8">
            <div>
              <h1 className="text-4xl font-display font-semibold text-brand-950 mb-2">
                Homes for Sale in {neighborhoodName}
              </h1>
              <p className="text-lg text-brand-600 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {cityName}, {stateName}
              </p>
            </div>
            <Link href={`/listings?city=${cityName}&state=${stateAbbr}`} className="btn-primary">
              View All Listings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-cream-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-brand-500 mb-1">
                <Home className="w-4 h-4" />
                <span className="text-sm">Active Listings</span>
              </div>
              <div className="text-2xl font-display font-bold text-brand-900">
                {stats.listingsCount}
              </div>
            </div>
            {stats.medianPrice && (
              <div className="bg-cream-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-brand-500 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Median Price</span>
                </div>
                <div className="text-2xl font-display font-bold text-brand-900">
                  {formatPrice(stats.medianPrice)}
                </div>
              </div>
            )}
            {stats.avgPricePerSqft && (
              <div className="bg-cream-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-brand-500 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Avg $/Sqft</span>
                </div>
                <div className="text-2xl font-display font-bold text-brand-900">
                  ${stats.avgPricePerSqft}
                </div>
              </div>
            )}
            <div className="bg-cream-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-brand-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Avg Days on Market</span>
              </div>
              <div className="text-2xl font-display font-bold text-brand-900">
                {neighborhood?.daysOnMarket || '~30'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Listings */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-display font-semibold text-brand-900 mb-6">
                Available Homes
              </h2>
              
              {listings.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center">
                  <Home className="w-12 h-12 text-cream-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-brand-900 mb-2">
                    No listings yet
                  </h3>
                  <p className="text-brand-600 mb-6">
                    Be the first to list your home in {neighborhoodName}
                  </p>
                  <Link href="/list-your-home" className="btn-primary">
                    List Your Home Free
                  </Link>
                </div>
              )}

              {listings.length > 0 && (
                <div className="mt-8 text-center">
                  <Link 
                    href={`/listings?city=${cityName}&state=${stateAbbr}`}
                    className="btn-secondary"
                  >
                    View All {cityName} Listings
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* About Neighborhood */}
              <div className="bg-white rounded-2xl border border-cream-200 p-6">
                <h3 className="font-display font-semibold text-brand-900 mb-4">
                  About {neighborhoodName}
                </h3>
                <p className="text-brand-600 text-sm leading-relaxed mb-6">
                  {neighborhood?.description || 
                    `${neighborhoodName} is a desirable neighborhood in ${cityName}, ${stateName}. 
                    Residents enjoy a great quality of life with access to local amenities, 
                    schools, and recreation. Whether you're looking for a family-friendly 
                    community or a quiet retreat, ${neighborhoodName} offers something for everyone.`}
                </p>

                {/* Neighborhood Features */}
                {neighborhood?.highlights && neighborhood.highlights.length > 0 && (
                  <div className="space-y-2">
                    {neighborhood.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2" />
                        <span className="text-brand-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Neighborhood Scores */}
              <div className="bg-white rounded-2xl border border-cream-200 p-6">
                <h3 className="font-display font-semibold text-brand-900 mb-4">
                  Neighborhood Scores
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-brand-600 flex items-center gap-2">
                        <Car className="w-4 h-4" /> Walk Score
                      </span>
                      <span className="font-medium text-brand-900">
                        {neighborhood?.walkScore || 'N/A'}
                      </span>
                    </div>
                    <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${neighborhood?.walkScore || 50}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-brand-600 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> Schools
                      </span>
                      <span className="font-medium text-brand-900">
                        {neighborhood?.schoolRating || 'Good'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-brand-600 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Safety
                      </span>
                      <span className="font-medium text-brand-900">
                        {neighborhood?.crimeRating || 'Average'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-brand-600 rounded-2xl p-6 text-white text-center">
                <h3 className="font-display font-semibold text-lg mb-2">
                  Selling in {neighborhoodName}?
                </h3>
                <p className="text-brand-200 text-sm mb-4">
                  List your home for free and save thousands in agent fees
                </p>
                <Link href="/list-your-home" className="btn bg-white text-brand-900 hover:bg-cream-100 w-full">
                  List Your Home
                </Link>
              </div>

              {/* Mortgage Calculator Link */}
              <div className="bg-white rounded-2xl border border-cream-200 p-6 text-center">
                <h3 className="font-display font-semibold text-brand-900 mb-2">
                  Calculate Your Payment
                </h3>
                <p className="text-sm text-brand-600 mb-4">
                  See what you can afford in {neighborhoodName}
                </p>
                <Link href="/calculators/mortgage" className="btn-secondary w-full">
                  Mortgage Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-white border-t border-cream-200">
        <div className="container-narrow">
          <h2 className="text-2xl font-display font-semibold text-brand-900 mb-6 text-center">
            Living in {neighborhoodName}, {cityName}
          </h2>
          <div className="prose prose-brand max-w-none text-brand-600">
            <p>
              {neighborhoodName} is one of the most sought-after neighborhoods in {cityName}, {stateName}. 
              Known for its {neighborhood?.highlights?.[0]?.toLowerCase() || 'welcoming community'}, 
              this area offers residents a perfect blend of suburban comfort and urban convenience.
            </p>
            <p>
              Home buyers in {neighborhoodName} can expect to find a variety of property types, 
              from single-family homes to condos and townhouses. The median home price in the area 
              is {stats.medianPrice ? formatPrice(stats.medianPrice) : 'competitive'}, making it 
              an attractive option for both first-time buyers and those looking to upgrade.
            </p>
            <p>
              When you buy a home for sale by owner (FSBO) in {neighborhoodName}, you can save 
              thousands in real estate agent commissions. Our free platform connects you directly 
              with homeowners, providing AI-powered tools to make the process smooth and transparent.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

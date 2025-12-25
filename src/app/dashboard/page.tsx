import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  Home, 
  Heart, 
  MessageSquare, 
  Settings, 
  TrendingUp,
  Eye,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { formatPrice, formatNumber, formatRelativeTime } from '@/lib/utils';

async function getDashboardData(userId: string) {
  const [listings, inquiries, savedCount] = await Promise.all([
    prisma.listing.findMany({
      where: { userId },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { inquiries: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.inquiry.findMany({
      where: {
        listing: { userId },
        status: 'PENDING',
      },
      include: {
        listing: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.savedListing.count({ where: { userId } }),
  ]);

  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const totalInquiries = listings.reduce((sum, l) => sum + l._count.inquiries, 0);

  return { listings, inquiries, savedCount, totalViews, totalInquiries };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const { listings, inquiries, savedCount, totalViews, totalInquiries } =
    await getDashboardData(session.user.id);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-wide py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold text-brand-900">
              Welcome back, {session.user.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-brand-600 mt-1">
              Here's what's happening with your listings
            </p>
          </div>
          <Link href="/list-your-home" className="btn-primary">
            <Plus className="w-4 h-4" />
            New Listing
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <Home className="w-5 h-5 text-brand-500" />
              <span className="text-2xs text-forest-600 bg-forest-100 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="text-3xl font-display font-bold text-brand-900">
              {listings.filter((l) => l.status === 'ACTIVE').length}
            </div>
            <div className="text-sm text-brand-500">Active Listings</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-5 h-5 text-brand-500" />
            </div>
            <div className="text-3xl font-display font-bold text-brand-900">
              {formatNumber(totalViews)}
            </div>
            <div className="text-sm text-brand-500">Total Views</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-5 h-5 text-brand-500" />
              {inquiries.length > 0 && (
                <span className="text-2xs text-white bg-brand-600 px-2 py-0.5 rounded-full">
                  {inquiries.length} new
                </span>
              )}
            </div>
            <div className="text-3xl font-display font-bold text-brand-900">
              {totalInquiries}
            </div>
            <div className="text-sm text-brand-500">Inquiries</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-5 h-5 text-brand-500" />
            </div>
            <div className="text-3xl font-display font-bold text-brand-900">
              {savedCount}
            </div>
            <div className="text-sm text-brand-500">Saved Homes</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Listings */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between p-6 border-b border-cream-200">
                <h2 className="text-lg font-display font-semibold text-brand-900">
                  My Listings
                </h2>
                <Link
                  href="/dashboard/listings"
                  className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {listings.length === 0 ? (
                <div className="p-12 text-center">
                  <Home className="w-12 h-12 text-cream-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-brand-900 mb-2">
                    No listings yet
                  </h3>
                  <p className="text-brand-600 mb-6">
                    Create your first listing and start receiving inquiries
                  </p>
                  <Link href="/list-your-home" className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Create Listing
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-cream-200">
                  {listings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/dashboard/listings/${listing.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-cream-50 transition-colors"
                    >
                      <div className="w-20 h-16 rounded-lg bg-cream-100 overflow-hidden flex-shrink-0">
                        {listing.images[0] && (
                          <img
                            src={listing.images[0].url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-brand-900 truncate">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-brand-500 truncate">
                          {listing.city}, {listing.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-semibold text-brand-900">
                          {formatPrice(listing.price)}
                        </div>
                        <div className="text-xs text-brand-500">
                          {listing.views} views • {listing._count.inquiries} inquiries
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          listing.status === 'ACTIVE'
                            ? 'bg-forest-100 text-forest-700'
                            : listing.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-cream-200 text-brand-600'
                        }`}
                      >
                        {listing.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div>
            <div className="card">
              <div className="flex items-center justify-between p-6 border-b border-cream-200">
                <h2 className="text-lg font-display font-semibold text-brand-900">
                  Recent Inquiries
                </h2>
                <Link
                  href="/dashboard/inquiries"
                  className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-10 h-10 text-cream-300 mx-auto mb-3" />
                  <p className="text-sm text-brand-500">No new inquiries</p>
                </div>
              ) : (
                <div className="divide-y divide-cream-200">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-brand-900 text-sm">
                          {inquiry.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-brand-400">
                          {formatRelativeTime(inquiry.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-brand-600 line-clamp-2 mb-2">
                        {inquiry.message}
                      </p>
                      <Link
                        href={`/listing/${inquiry.listing.slug}`}
                        className="text-xs text-brand-500 hover:text-brand-700"
                      >
                        Re: {inquiry.listing.title}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="card mt-6 p-6">
              <h2 className="text-lg font-display font-semibold text-brand-900 mb-4">
                Quick Links
              </h2>
              <nav className="space-y-2">
                <Link
                  href="/dashboard/listings"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-50 transition-colors"
                >
                  <Home className="w-5 h-5 text-brand-500" />
                  <span className="text-brand-700">My Listings</span>
                </Link>
                <Link
                  href="/dashboard/saved"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-50 transition-colors"
                >
                  <Heart className="w-5 h-5 text-brand-500" />
                  <span className="text-brand-700">Saved Homes</span>
                </Link>
                <Link
                  href="/dashboard/inquiries"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-50 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-brand-500" />
                  <span className="text-brand-700">All Inquiries</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-brand-500" />
                  <span className="text-brand-700">Settings</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Heart, Search, Trash2 } from 'lucide-react';
import { ListingCard } from '@/components/listings/ListingCard';
import { RemoveSavedButton } from '@/components/listings/RemoveSavedButton';

async function getSavedListings(userId: string) {
  return prisma.savedListing.findMany({
    where: { userId },
    include: {
      listing: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function SavedListingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard/saved');
  }

  const savedListings = await getSavedListings(session.user.id);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-wide py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold text-brand-900">
              Saved Homes
            </h1>
            <p className="text-brand-600 mt-1">
              {savedListings.length} {savedListings.length === 1 ? 'home' : 'homes'} saved
            </p>
          </div>
          <Link href="/listings" className="btn-secondary">
            <Search className="w-4 h-4" />
            Browse More
          </Link>
        </div>

        {/* Saved Listings */}
        {savedListings.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((saved) => (
              <div key={saved.id} className="relative group">
                <ListingCard listing={saved.listing} showSaveButton={false} />
                <RemoveSavedButton 
                  listingId={saved.listingId}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-cream-200 p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-cream-400" />
            </div>
            <h2 className="text-xl font-display font-semibold text-brand-900 mb-2">
              No saved homes yet
            </h2>
            <p className="text-brand-600 mb-6 max-w-md mx-auto">
              When you find homes you like, click the heart icon to save them here 
              for easy access later.
            </p>
            <Link href="/listings" className="btn-primary">
              <Search className="w-4 h-4" />
              Start Browsing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

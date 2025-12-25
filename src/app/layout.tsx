import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: {
    default: 'HomeBase AI | Free For Sale By Owner Listings',
    template: '%s | HomeBase AI',
  },
  description:
    'List your home for free with AI-powered tools. Get professional listing descriptions, photo enhancements, and beat Zillow at SEO.',
  keywords: [
    'FSBO',
    'for sale by owner',
    'sell home without realtor',
    'free home listing',
    'AI real estate',
    'home selling',
  ],
  authors: [{ name: 'HomeBase AI' }],
  creator: 'HomeBase AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'HomeBase AI',
    title: 'HomeBase AI | Free For Sale By Owner Listings',
    description:
      'List your home for free with AI-powered tools. Professional listing descriptions, photo enhancements, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomeBase AI | Free For Sale By Owner Listings',
    description:
      'List your home for free with AI-powered tools. Professional listing descriptions, photo enhancements, and more.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scrollbar-thin">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          {/* Subtle noise texture */}
          <div className="noise-overlay" aria-hidden="true" />

          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#3a1a12',
                border: '1px solid #f3d5c5',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                boxShadow: '0 4px 14px 0 rgba(207, 115, 71, 0.15)',
              },
              success: {
                iconTheme: {
                  primary: '#518a5b',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

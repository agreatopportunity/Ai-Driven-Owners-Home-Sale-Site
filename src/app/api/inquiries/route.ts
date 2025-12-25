import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const inquirySchema = z.object({
  listingId: z.string(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const result = inquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { listingId, name, email, phone, message } = result.data;

    // Verify listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, userId: true },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        listingId,
        message,
        userId: session?.user?.id || null,
        name: session?.user?.name || name || null,
        email: session?.user?.email || email || null,
        phone: phone || null,
      },
    });

    // TODO: Send email notification to listing owner

    return NextResponse.json({ id: inquiry.id }, { status: 201 });
  } catch (error) {
    console.error('Create inquiry error:', error);
    return NextResponse.json(
      { error: 'Failed to send inquiry' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import type { AvailabilityStatus, AvailabilityUpdate } from '@/lib/types';

// Mock database for availability updates
const mockAvailabilityUpdates: AvailabilityUpdate[] = [];

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { status } = await request.json();
    
    if (!status || !['available', 'busy', 'free'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid availability status' },
        { status: 400 }
      );
    }
    
    // Create availability update record
    const update: AvailabilityUpdate = {
      updateId: `update_${Date.now()}`,
      userId,
      statusType: status as AvailabilityStatus,
      timestamp: new Date(),
    };
    
    mockAvailabilityUpdates.push(update);
    
    // In a real app, this would also:
    // 1. Update the user's current status in the database
    // 2. Trigger real-time updates to subscribers
    // 3. Potentially publish to Farcaster
    
    return NextResponse.json({ success: true, update });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Get recent availability updates for the user
    const userUpdates = mockAvailabilityUpdates
      .filter(update => update.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
    
    return NextResponse.json(userUpdates);
  } catch (error) {
    console.error('Error fetching availability updates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

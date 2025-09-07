import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@/lib/types';

// Mock database - in production, this would be replaced with Supabase
const mockUsers: Record<string, User> = {
  'user1': {
    userId: 'user1',
    farcasterId: 'fid123',
    username: 'sarah_adams',
    bio: 'Full-stack developer & startup advisor',
    availabilityStatus: 'available',
    servicesOffered: []
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const user = mockUsers[userId];
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const updates = await request.json();
    
    if (!mockUsers[userId]) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user data
    mockUsers[userId] = {
      ...mockUsers[userId],
      ...updates,
    };
    
    return NextResponse.json(mockUsers[userId]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

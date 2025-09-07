import { NextRequest, NextResponse } from 'next/server';
import type { Service } from '@/lib/types';
import { MOCK_SERVICES } from '@/lib/constants';

// Mock database - in production, this would be replaced with Supabase
let mockServices: Service[] = [...MOCK_SERVICES];

export async function GET(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = params;
    const service = mockServices.find(s => s.serviceId === serviceId);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = params;
    const updates = await request.json();
    
    const serviceIndex = mockServices.findIndex(s => s.serviceId === serviceId);
    
    if (serviceIndex === -1) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Update service data
    mockServices[serviceIndex] = {
      ...mockServices[serviceIndex],
      ...updates,
    };
    
    return NextResponse.json(mockServices[serviceIndex]);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = params;
    const serviceIndex = mockServices.findIndex(s => s.serviceId === serviceId);
    
    if (serviceIndex === -1) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Remove service from array
    mockServices.splice(serviceIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

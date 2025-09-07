import { NextRequest, NextResponse } from 'next/server';
import type { Service } from '@/lib/types';
import { MOCK_SERVICES } from '@/lib/constants';

// Mock database - in production, this would be replaced with Supabase
let mockServices: Service[] = [...MOCK_SERVICES];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    
    let filteredServices = mockServices;
    
    // Filter by user ID if provided
    if (userId) {
      filteredServices = filteredServices.filter(service => service.userId === userId);
    }
    
    // Filter by category if provided
    if (category) {
      filteredServices = filteredServices.filter(service => service.category === category);
    }
    
    return NextResponse.json(filteredServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json();
    
    // Validate required fields
    if (!serviceData.name || !serviceData.description || !serviceData.category || !serviceData.userId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, category, userId' },
        { status: 400 }
      );
    }
    
    // Create new service
    const newService: Service = {
      serviceId: `service_${Date.now()}`,
      userId: serviceData.userId,
      name: serviceData.name,
      description: serviceData.description,
      category: serviceData.category,
      price: serviceData.price || undefined,
    };
    
    mockServices.push(newService);
    
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

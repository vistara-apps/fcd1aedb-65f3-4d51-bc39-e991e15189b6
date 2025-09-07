import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: string;
  sessionId?: string;
  userId?: string;
}

// Mock analytics storage - in production, this would be sent to analytics service
const analyticsEvents: AnalyticsEvent[] = [];

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    if (!eventData.event) {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      );
    }
    
    // Create analytics event
    const analyticsEvent: AnalyticsEvent = {
      event: eventData.event,
      properties: eventData.properties || {},
      timestamp: eventData.timestamp || new Date().toISOString(),
      sessionId: eventData.sessionId,
      userId: eventData.userId,
    };
    
    // Store event (in production, this would be sent to analytics service like Mixpanel, Amplitude, etc.)
    analyticsEvents.push(analyticsEvent);
    
    // Log for debugging
    console.log('Analytics event tracked:', analyticsEvent);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const event = searchParams.get('event');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    let filteredEvents = analyticsEvents;
    
    // Filter by event type if provided
    if (event) {
      filteredEvents = filteredEvents.filter(e => e.event === event);
    }
    
    // Filter by user ID if provided
    if (userId) {
      filteredEvents = filteredEvents.filter(e => e.userId === userId);
    }
    
    // Sort by timestamp (most recent first) and limit results
    const sortedEvents = filteredEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return NextResponse.json({
      events: sortedEvents,
      total: filteredEvents.length,
    });
  } catch (error) {
    console.error('Error fetching analytics events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

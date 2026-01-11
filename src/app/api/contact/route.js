import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // For now, just log the message (Supabase integration will be added later)
    console.log('Contact form submission:', { name, email, message });

    // Simulate successful submission
    return NextResponse.json(
      {
        success: true,
        message: 'Message received! We\'ll get back to you soon.',
        note: 'Contact form is in demo mode. Supabase integration coming soon.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

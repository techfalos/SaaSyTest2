import { NextRequest, NextResponse } from 'next/server';
import { withSecurityHeaders } from '../../../server/security-config';
import { sanitizeUserInput } from '../../../utils/security';

/**
 * Example of a secure API route with proper security headers and input sanitization
 */

async function handler(request: NextRequest) {
  try {
    // Example: Handle POST request with user input
    if (request.method === 'POST') {
      const body = await request.json();
      
      // Sanitize all user inputs
      const sanitizedData = {
        name: sanitizeUserInput(body.name || ''),
        message: sanitizeUserInput(body.message || ''),
      };
      
      // Process the sanitized data
      console.log('Received sanitized data:', sanitizedData);
      
      return NextResponse.json(
        { 
          success: true, 
          data: sanitizedData,
          message: 'Data processed securely' 
        },
        { status: 200 }
      );
    }
    
    // Handle GET request
    return NextResponse.json(
      { 
        message: 'This is a secure API endpoint',
        security: 'All responses include security headers' 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Don't expose internal error details to clients
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export wrapped handler with security headers
export const GET = withSecurityHeaders(handler);
export const POST = withSecurityHeaders(handler);

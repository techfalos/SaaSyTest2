

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { db_add, db_init } from '../../../database/supabase';
const db = await db_init();

export async function POST(request: Request) {
    try {
        const { token, name, email, message } = await request.json();
// Insert into database using db_add helper
        await db_add(db, 'Contact', {
            ID: uuidv4(),
          ContactName: name,
          ContactEmail: email,
          Message: message
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error in contact API:', error);
        return NextResponse.json(
        { success: false, error: 'Failed to submit contact form' },
        { status: 500 }
        );
    }
}
    
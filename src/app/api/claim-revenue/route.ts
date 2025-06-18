/* eslint-disable @typescript-eslint/no-unused-vars */


/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { networkInfo, publicClient } from '../../lib/config';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { ipId } = body;

        // Validate input
        if (!ipId) {
            throw new Error('Missing required field: ipId');
        }
        if (!/^0x[a-fA-F0-9]{40}$/.test(ipId)) {
            throw new Error('Invalid IP ID format');
        }

        // Ensure PROTOCOL_EXPLORER is defined
        const protocolExplorer = process.env.PROTOCOL_EXPLORER || 'https://aeneid.explorer.story.foundation';
        if (!process.env.PROTOCOL_EXPLORER) {
            console.warn('PROTOCOL_EXPLORER not set in environment variables. Using fallback:', protocolExplorer);
        }

        // Return minimal response since transaction is handled client-side
        return NextResponse.json({
            success: true,
            protocolExplorer,
        });
    } catch (error: any) {
        console.error('Error processing request:', {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { success: false, error: `Failed to process request: ${error.message}` },
            { status: 400 }
        );
    }
}
// app/api/profile/status/route.ts
// Change the import:
// import pool from '@/lib/db'; // Remove this
import { getDbPool } from '@/lib/db'; // Import the function to get the pool
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
    console.log('[API Profile Status] Received GET request.');
    const authResult = getAuth(req);

    if (!authResult.userId) {
        console.log('[API Profile Status] Unauthorized: No userId found.');
        return NextResponse.json({ error: 'Unauthorized - Invalid session or token' }, { status: 401 });
    }

    const userId = authResult.userId;
    console.log(`[API Profile Status] Authorized for userId: ${userId}`);

    let connection;
    try {
        const pool = getDbPool(); // Get the initialized pool instance
        const sql = "SELECT user_id FROM career_forms WHERE user_id = ? LIMIT 1";

        console.log("[API Profile Status] Attempting to get connection...");
        connection = await pool.getConnection(); // Now this should work
        console.log("[API Profile Status] DB Connection acquired.");

        console.log("[API Profile Status] Executing query...");
        const [rows] = await connection.execute<RowDataPacket[]>(sql, [userId]);
        console.log("[API Profile Status] Query executed.");

        const exists = rows.length > 0;
        console.log(`[API Profile Status] Profile exists check result for user ${userId}: ${exists}`);
        return NextResponse.json({ exists });

    } catch (error: any) {
        console.error('[API Profile Status] Error checking profile status:', error);
        // Log if the error is related to getConnection itself
        if (error.message.includes('getConnection')) {
             console.error('[API Profile Status] Error specifically during getConnection() call.');
        }
        return NextResponse.json({ error: 'Failed to check profile status in database.', details: error.message }, { status: 500 });
    } finally {
         if (connection) {
            console.log("[API Profile Status] Releasing DB connection.");
            connection.release();
         } else {
             console.log("[API Profile Status] No DB connection to release.");
         }
    }
}
// app/api/recommendations/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getDbPool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import mysql from 'mysql2/promise';

// --- Interfaces ---
interface UserProfileFromDB extends RowDataPacket { user_id: string; skills: string | null; interests: string | null; goals: string | null; education: string | null; year_of_study: string | null; location_preference?: string | null; }
interface UserProfileProcessed { user_id: string; skills: string[]; interests: string[]; goals: string[]; education: string | null; experience_level: string; location_preference: string | null; }
interface JobFromDB extends RowDataPacket { id: number | string; title: string; company: string | null; location: string | null; salary: string | null; experience: string | null; tags: string | null; } // tags is JSON string
interface JobProcessed { id: number | string; title: string; company: string | null; location: string | null; salary: string | null; experience: string | null; tags: string[]; recommendationScore?: number; } // tags is string[]

// --- Helper: Parse JSON column safely ---
function parseJsonColumn(jsonData: string | null | undefined): string[] {
    if (!jsonData) return [];
    try {
        // First try to parse as JSON
        const parsed = JSON.parse(jsonData);
        return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (e) {
        // If JSON parsing fails, try to split by comma
        try {
            return jsonData.split(',').map(tag => tag.trim());
        } catch (e) {
            console.error(`Failed to parse column data. Data: "${jsonData}"`, e);
            return [];
        }
    }
}

// --- User Profile Fetching (MySQL) ---
async function getUserProfile(userId: string): Promise<UserProfileProcessed | null> {
    console.log(`[API Rec Jobs] Fetching profile for user: ${userId} from MySQL`);
    if (!userId) return null;
    let connection: mysql.PoolConnection | undefined;
    try {
        const pool = getDbPool();
        // !! Add location_preference if you added it to the table !!
        const sql = `SELECT user_id, skills, interests, goals, education, year_of_study /*, location_preference */ FROM career_forms WHERE user_id = ? LIMIT 1`;
        connection = await pool.getConnection();
        const [rows] = await connection.execute<UserProfileFromDB[]>(sql, [userId]);
        if (rows.length === 0) { console.log(`[API Rec Jobs] Profile not found for ${userId}`); return null; }
        const dbProfile = rows[0];
        // *** Crucial: Parsing happens here ***
        const processedProfile: UserProfileProcessed = {
            user_id: dbProfile.user_id,
            skills: parseJsonColumn(dbProfile.skills),
            interests: parseJsonColumn(dbProfile.interests),
            goals: parseJsonColumn(dbProfile.goals),
            education: dbProfile.education,
            experience_level: inferUserExperienceLevel(dbProfile), // Needs this helper
            location_preference: dbProfile.location_preference?.toLowerCase() || null,
        };
        console.log(`[API Rec Jobs] Profile found for ${userId}. Level: ${processedProfile.experience_level}`);
        return processedProfile;
    } catch (error) { console.error(`[API Rec Jobs] MySQL error fetching profile for ${userId}:`, error); return null; }
    finally { if (connection) connection.release(); }
}

// --- Helper: Infer User Experience Level ---
function inferUserExperienceLevel(profile: UserProfileFromDB | null): string {
    if (!profile) return 'fresher';
    const yearMatch = profile.year_of_study?.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : 0;
    const currentYear = new Date().getFullYear();
    const yearsSinceGrad = (year > 1980 && year <= currentYear) ? currentYear - year : 0;
    if (yearsSinceGrad >= 8) return '8+ years';
    if (yearsSinceGrad >= 5) return '5-8 years';
    if (yearsSinceGrad >= 3) return '3-5 years';
    if (yearsSinceGrad >= 1) return '1-3 years';
    return 'fresher';
}

// --- Job Data Fetching (MySQL - Placeholder) ---
async function fetchAllJobs(): Promise<JobProcessed[]> {
    console.log("[API Rec Jobs] Fetching job data from MySQL...");
    let connection: mysql.PoolConnection | undefined;
    try {
        const pool = getDbPool();
        // !! REPLACE 'jobs' AND COLUMNS WITH YOUR ACTUAL TABLE !!
        const sql = `SELECT id, title, company, location, salary, experience, tags FROM jobs WHERE status = 'active' ORDER BY posted_date DESC LIMIT 300`;
        connection = await pool.getConnection();
        const [rows] = await connection.execute<JobFromDB[]>(sql);
        // *** Crucial: Parsing happens here ***
        const processedJobs = rows.map(job => ({ ...job, tags: parseJsonColumn(job.tags) }));
        console.log(`[API Rec Jobs] Fetched ${processedJobs.length} jobs from DB.`);
        return processedJobs;
    } catch (error) { console.error("[API Rec Jobs] MySQL error fetching jobs:", error); return []; } // Return empty on error
    finally { if (connection) connection.release(); }
}

// --- Recommendation Scoring Logic for Jobs (Keep as is) ---
function calculateJobScore(userProfile: UserProfileProcessed | null, job: JobProcessed | null): number { /* ... implementation ... */ return Math.random()*10; } // Placeholder score

// --- API Route Handler ---
export async function GET(req: NextRequest) {
    const { userId } = getAuth(req);
    console.log(`[API Rec Jobs] Received GET request. Auth UserID from getAuth: ${userId}`);
    if (!userId) { /* ... unauthorized ... */ return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

     try {
        const userProfile = await getUserProfile(userId);
        if (!userProfile) { /* ... profile not found ... */ return NextResponse.json({ recommendations: [], message: 'Complete profile for job recommendations.' }); }
        const allJobs = await fetchAllJobs();
        if (!allJobs || allJobs.length === 0) { /* ... no jobs ... */ return NextResponse.json({ recommendations: [], message: "No jobs available." }); }
        const scoredJobs = allJobs.map(job => ({ ...job, recommendationScore: calculateJobScore(userProfile, job) })).filter(job => job.recommendationScore > 0);
        scoredJobs.sort((a, b) => b.recommendationScore - a.recommendationScore);
        const limit = 10;
        const topRecommendations = scoredJobs.slice(0, limit);
        console.log(`[API Rec Jobs] Returning top ${topRecommendations.length}.`);
        return NextResponse.json({ recommendations: topRecommendations });
    } catch (error: any) { /* ... error handling ... */ console.error("[API Rec Jobs] Error:", error); return NextResponse.json({ error: 'Failed to generate recommendations.', details: error.message }, { status: 500 }); }
}
// app/api/recommendations/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getDbPool } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import mysql from 'mysql2/promise';

// --- Interfaces (Keep as before, ensure consistent) ---
interface UserProfileFromDB extends RowDataPacket { user_id: string; skills: string | null; interests: string | null; goals: string | null; education: string | null; year_of_study: string | null; learning_type: string | null; }
interface UserProfileProcessed { user_id: string; skills: string[]; interests: string[]; goals: string[]; education: string | null; year_of_study: string | null; learning_type: string | null; level: 'beginner' | 'intermediate' | 'advanced'; } // Level is now specific enum
interface CourseFromDB extends RowDataPacket { id: number | string; title: string; description: string | null; level: string | null; provider: string | null; rating: number | null; students: number | null; price: number | null; tags: string | null; } // JSON string
interface CourseProcessed { id: number | string; title: string; description: string | null; level: string | null; provider: string | null; rating: number | null; students: number | null; price: number | null; tags: string[]; recommendationScore?: number; isPresetMatch?: boolean; }

// --- Helper: Parse JSON column safely ---
function parseJsonColumn(jsonData: string | null | undefined): string[] {
    if (!jsonData) return [];
    try { const parsed = JSON.parse(jsonData); return Array.isArray(parsed) ? parsed.map(String) : []; }
    catch (e) { console.error(`Failed to parse JSON column. Data: "${jsonData}"`, e); return []; }
}

// --- Helper: Infer User Level (0-1 years = beginner) ---
function inferUserLevel(profile: UserProfileFromDB | null): 'beginner' | 'intermediate' | 'advanced' {
    if (!profile) return 'beginner';
    const yearMatch = profile.year_of_study?.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : 0;
    const currentYear = new Date().getFullYear();
    const yearsSinceGrad = (year > 1980 && year <= currentYear) ? currentYear - year : 0;
    const skillsCount = parseJsonColumn(profile.skills).length; // Parse here

    // Explicit 0-1 year rule
    if (yearsSinceGrad >= 0 && yearsSinceGrad <= 1) return 'beginner';

    // Existing logic for others (adjust thresholds as needed)
    if (profile.education?.toLowerCase().includes('master') || profile.education?.toLowerCase().includes('phd')) return 'advanced';
    if (yearsSinceGrad >= 5 || skillsCount > 10) return 'advanced'; // Adjusted threshold slightly
    if (yearsSinceGrad >= 2 || skillsCount > 5) return 'intermediate'; // Adjusted threshold slightly

    return 'beginner'; // Default fallback
}


// --- User Profile Fetching (MySQL - Keep as before) ---
async function getUserProfile(userId: string): Promise<UserProfileProcessed | null> {
    // ... (Keep the existing implementation using getDbPool, execute, parseJsonColumn, inferUserLevel) ...
     console.log(`[API Rec Courses] Fetching profile for user: ${userId} from MySQL`);
    if (!userId) return null;
    let connection: mysql.PoolConnection | undefined;
    try {
        const pool = getDbPool();
        const sql = `SELECT user_id, skills, interests, goals, education, year_of_study, learning_type FROM career_forms WHERE user_id = ? LIMIT 1`;
        connection = await pool.getConnection();
        const [rows] = await connection.execute<UserProfileFromDB[]>(sql, [userId]);
        if (rows.length === 0) { console.log(`[API Rec Courses] Profile not found for ${userId}`); return null; }
        const dbProfile = rows[0];
        const processedProfile: UserProfileProcessed = {
            user_id: dbProfile.user_id,
            skills: parseJsonColumn(dbProfile.skills),
            interests: parseJsonColumn(dbProfile.interests),
            goals: parseJsonColumn(dbProfile.goals),
            education: dbProfile.education, year_of_study: dbProfile.year_of_study, learning_type: dbProfile.learning_type,
            level: inferUserLevel(dbProfile), // Use the refined level inference
        };
        console.log(`[API Rec Courses] Profile found for ${userId}. Inferred Level: ${processedProfile.level}`);
        return processedProfile;
    } catch (error) { console.error(`[API Rec Courses] MySQL error fetching profile for ${userId}:`, error); return null; }
    finally { if (connection) connection.release(); }
}

// --- Preset Interest Definitions ---
const PRESET_INTEREST_KEYWORDS: { [key: string]: string[] } = {
    'web development': ['web development', 'frontend', 'backend', 'fullstack', 'html', 'css', 'javascript', 'react', 'angular', 'vue', 'nodejs'],
    'android development': ['android development', 'mobile development', 'kotlin', 'java', 'jetpack compose', 'android'],
    'cyber security': ['cyber security', 'security analyst', 'network security', 'infosec', 'penetration testing', 'comptia security+'],
};
const ALL_PRESET_KEYS = Object.keys(PRESET_INTEREST_KEYWORDS);


// --- Fetch Specific Preset Courses based on User Interest & Level (MySQL) ---
async function fetchPresetCourses(
    interestKeys: string[],
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    pool: mysql.Pool
): Promise<CourseProcessed[]> {
    if (interestKeys.length === 0) return [];
    console.log(`[API Rec Courses] Fetching presets for interests: [${interestKeys.join(', ')}] and level: ${userLevel}`);

    let connection: mysql.PoolConnection | undefined;
    try {
        // Construct WHERE clause dynamically using JSON_CONTAINS
        // Check if tags contain BOTH the interest keyword AND the user level
        const conditions = interestKeys.map(key =>
            PRESET_INTEREST_KEYWORDS[key].map(keyword =>
                `(JSON_CONTAINS(tags, '${JSON.stringify(keyword)}', '$') AND JSON_CONTAINS(tags, '${JSON.stringify(userLevel)}', '$'))`
            ).join(' OR ') // Join keywords for one interest with OR
        );

        // Join different interest groups with OR
        const whereClause = conditions.map(group => `(${group})`).join(' OR ');

        // !! Ensure your table/column names are correct !!
        const sql = `
            SELECT id, title, description, level, provider, rating, students, price, tags
            FROM courses
            WHERE ${whereClause}
            ORDER BY FIELD(level, 'beginner', 'intermediate', 'advanced'), rating DESC
            LIMIT ${interestKeys.length * 2}; -- Limit to fetch a few options per interest
        `; // Added FIELD ordering

        console.log("[API Rec Courses] Preset Query SQL:", sql); // Log the generated SQL

        connection = await pool.getConnection();
        const [rows] = await connection.execute<CourseFromDB[]>(sql);

        const presets = rows.map(course => ({
            ...course,
            tags: parseJsonColumn(course.tags),
            isPresetMatch: true, // Mark these as presets
            recommendationScore: 1000 + (course.rating || 0) // Give high base score
        }));
        console.log(`[API Rec Courses] Found ${presets.length} preset courses matching criteria.`);
        return presets;

    } catch (error: any) {
        console.error("[API Rec Courses] MySQL error fetching preset courses:", error);
        return []; // Return empty on error
    } finally {
        if (connection) connection.release();
    }
}


// --- Fetch General Courses (Excluding Specific IDs if needed) (MySQL) ---
async function fetchGeneralCourses(
    excludeIds: (string | number)[],
    pool: mysql.Pool
): Promise<CourseProcessed[]> {
    console.log("[API Rec Courses] Fetching general course data from MySQL...");
    let connection: mysql.PoolConnection | undefined;
    try {
        // Construct WHERE clause for exclusion
        let whereClause = '';
        const params: (string | number)[] = [];
        if (excludeIds.length > 0) {
            whereClause = `WHERE id NOT IN (${excludeIds.map(() => '?').join(',')})`;
            params.push(...excludeIds);
        }

        // !! Ensure your table/column names are correct !!
        const sql = `
            SELECT id, title, description, level, provider, rating, students, price, tags
            FROM courses
            ${whereClause}
            ORDER BY students DESC, rating DESC -- Example ordering
            LIMIT 150 -- Fetch a pool of general courses to score
        `;

        console.log("[API Rec Courses] General Query SQL:", sql);
        console.log("[API Rec Courses] General Query Params:", params);

        connection = await pool.getConnection();
        const [rows] = await connection.execute<CourseFromDB[]>(sql, params);

        const processedCourses = rows.map(course => ({
            ...course,
            tags: parseJsonColumn(course.tags),
            isPresetMatch: false // Mark as not a specific preset match for *this* user/level
        }));
        console.log(`[API Rec Courses] Fetched ${processedCourses.length} general courses from DB.`);
        return processedCourses;

    } catch (error: any) {
        console.error("[API Rec Courses] MySQL error fetching general courses:", error);
        return [];
    } finally {
        if (connection) connection.release();
    }
}


// --- Recommendation Scoring Logic (Keep as before) ---
function calculateCourseScore(userProfile: UserProfileProcessed | null, course: CourseProcessed | null): number {
    // ... (Keep the existing scoring logic) ...
    if (!userProfile || !course) return 0; let score = 0; const userSkills = new Set(userProfile.skills?.map(s => s.toLowerCase().trim()) || []); const userInterests = new Set(userProfile.interests?.map(i => i.toLowerCase().trim()) || []); const userGoals = userProfile.goals?.map(g => g.toLowerCase().trim()) || []; const courseTags = new Set(course.tags?.map(t => t.toLowerCase().trim()) || []); const courseTitleLower = course.title?.toLowerCase() || ""; const userLevel = userProfile.level?.toLowerCase(); const courseLevel = course.level?.toLowerCase(); let skillMatchCount = 0; userSkills.forEach(skill => { if (courseTags.has(skill)) { skillMatchCount++; score += 5; } else if (courseTitleLower.includes(skill)) { score += 2; } }); userInterests.forEach(interest => { if (courseTags.has(interest)) { score += 3; } if (courseTitleLower.includes(interest)) { score += 1; } }); userGoals.forEach(goal => { courseTags.forEach(tag => { if (goal.split(' ').some(gWord => tag === gWord) || tag.split(' ').some(tWord => goal.includes(tWord))) { score += 2; } }); if (courseTitleLower.includes(goal.split(' ')[0])) { score += 1; } }); if (userLevel && courseLevel) { if (userLevel === courseLevel) score += 2; else if ((userLevel === 'beginner' && courseLevel === 'intermediate') || (userLevel === 'intermediate' && courseLevel === 'advanced')) { score += 1; } else if ((userLevel === 'advanced' && courseLevel === 'intermediate') || (userLevel === 'intermediate' && courseLevel === 'beginner')) { score -= 1; } else if (userLevel === 'beginner' && courseLevel === 'advanced') { score -= 3; } } score += Math.min(2, Math.floor(((course.rating ?? 0) - 4.0) * 2)); score += Math.min(2, Math.floor((course.students ?? 0) / 10000)); if (skillMatchCount >= 3 && userSkills.size >= 5 && (skillMatchCount / userSkills.size) > 0.5) { score = Math.max(0, score - 2); } if (userProfile.learning_type && courseTags.has(userProfile.learning_type.toLowerCase())) { score += 1; } return score;
}


// --- API Route Handler ---
export async function GET(req: NextRequest) {
    const { userId } = getAuth(req);
    console.log(`[API Rec Courses] Received GET request. Auth UserID from getAuth: ${userId}`);
    if (!userId) { /* ... unauthorized ... */ return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

    const pool = getDbPool(); // Get pool instance once

    try {
        const userProfile = await getUserProfile(userId); // Fetches profile and infers level
        if (!userProfile) { /* ... profile not found ... */ return NextResponse.json({ recommendations: [], message: 'Complete profile for recommendations.' }); }

        // Identify user's preset interests
        const userInterestsLower = userProfile.interests.map(i => i.toLowerCase());
        const matchingPresetKeys = ALL_PRESET_KEYS.filter(key =>
            PRESET_INTEREST_KEYWORDS[key].some(keyword => userInterestsLower.includes(keyword))
        );
        console.log("[API Rec Courses] User matching preset interest keys:", matchingPresetKeys);

        // Fetch specific preset courses for user's level and interests
        const presetCourses = await fetchPresetCourses(matchingPresetKeys, userProfile.level, pool);
        const presetCourseIds = presetCourses.map(c => c.id);

        // Fetch general courses, excluding the presets we already specifically found
        const generalCourses = await fetchGeneralCourses(presetCourseIds, pool);

        // Score the general courses
        const scoredGeneralCourses = generalCourses
            .map(course => ({
                ...course,
                recommendationScore: calculateCourseScore(userProfile, course),
            }))
            .filter(course => course.recommendationScore > 0); // Only keep relevant ones

        // Sort scored general courses
        scoredGeneralCourses.sort((a, b) => (b.recommendationScore ?? 0) - (a.recommendationScore ?? 0));

        // Combine: Presets first, then top scored general courses
        const finalRecommendations = [...presetCourses, ...scoredGeneralCourses];

        // Limit the final list
        const limit = 8; // Adjust total recommendations desired
        const topRecommendations = finalRecommendations.slice(0, limit);

        console.log(`[API Rec Courses] Total combined recommendations before limit: ${finalRecommendations.length}. Returning top ${topRecommendations.length}.`);
        console.log("[API Rec Courses] Top recommendation titles:", topRecommendations.map(c => `${c.title} (Score: ${c.recommendationScore}, Preset: ${c.isPresetMatch})`));

        return NextResponse.json({ recommendations: topRecommendations });

    } catch (error: any) { /* ... error handling ... */ console.error("[API Rec Courses] Error:", error); return NextResponse.json({ error: 'Failed to generate recommendations.', details: error.message }, { status: 500 }); }
    // No finally block needed here as connections are released within helper functions
}
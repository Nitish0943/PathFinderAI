// app/api/career-form/route.ts
import { getDbPool } from '@/lib/db'; // Correct import
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
// Removed RowDataPacket import as execute result type handles it generally

// Helper function (keep as is)
const stringToJsonArrayString = (str: string | undefined | null): string => {
  if (!str || typeof str !== 'string') return JSON.stringify([]);
  const arr = str.split(',').map(item => item.trim()).filter(item => item.length > 0);
  return JSON.stringify(arr);
};

export async function POST(req: NextRequest) {
  console.log('\n--- Request to /api/career-form ---');
  const { userId } = getAuth(req);

  if (!userId) {
    console.error('[API Career Form] Unauthorized - userId missing from getAuth.');
    return NextResponse.json({ error: 'Unauthorized - Invalid session or token.' }, { status: 401 });
  }

  console.log(`[API Career Form] Authorized for userId: ${userId}`);
  let connection;

  try {
    const formData = await req.json();
    console.log('[API Career Form] Received formData:', formData);

    // Basic validation
    if (!formData.name || !formData.email || !formData.interests || !formData.skills) {
       console.log('[API Career Form] Missing required fields.');
       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare data for MySQL
    const dataToInsert = {
      user_id: userId,
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age, 10) || null,
      education: formData.education || null, // Ensure null if empty
      year_of_study: formData.year_of_study || null,
      gpa: !isNaN(parseFloat(formData.gpa)) ? parseFloat(formData.gpa) : null,
      interests: stringToJsonArrayString(formData.interests),
      skills: stringToJsonArrayString(formData.skills),
      soft_skills: stringToJsonArrayString(formData.soft_skills),
      certifications: formData.certifications || null,
      goals: stringToJsonArrayString(formData.goals),
      study_hours: formData.study_hours || null,
      timeline: formData.timeline || null,
      learning_type: formData.learning_type || null,
      language: formData.language || null,
      feedback: formData.feedback || null,
    };

    // --- FIX: Correct SQL Statement ---
    const sql = `
        INSERT INTO career_forms (
            user_id, name, email, age, education, year_of_study, gpa,
            interests, skills, soft_skills, certifications, goals,
            study_hours, timeline, learning_type, language, feedback
            -- created_at has default, updated_at is handled below or by DB trigger
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) -- 17 placeholders
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            email = VALUES(email),
            age = VALUES(age),
            education = VALUES(education),
            year_of_study = VALUES(year_of_study),
            gpa = VALUES(gpa),
            interests = VALUES(interests),
            skills = VALUES(skills),
            soft_skills = VALUES(soft_skills),
            certifications = VALUES(certifications),
            goals = VALUES(goals),
            study_hours = VALUES(study_hours),
            timeline = VALUES(timeline),
            learning_type = VALUES(learning_type),
            language = VALUES(language),
            feedback = VALUES(feedback),
            updated_at = CURRENT_TIMESTAMP; -- Ensure updated_at is handled
    `;

    // --- FIX: Ensure values array matches the 17 columns/placeholders ---
    const values = [
        dataToInsert.user_id, dataToInsert.name, dataToInsert.email, dataToInsert.age,
        dataToInsert.education, dataToInsert.year_of_study, dataToInsert.gpa,
        dataToInsert.interests, dataToInsert.skills, dataToInsert.soft_skills,
        dataToInsert.certifications, dataToInsert.goals, dataToInsert.study_hours,
        dataToInsert.timeline, dataToInsert.learning_type, dataToInsert.language,
        dataToInsert.feedback
    ];
    // --- End FIX ---


    const pool = getDbPool();
    console.log('[API Career Form] Attempting MySQL Upsert for user:', userId);
    connection = await pool.getConnection();
    console.log('[API Career Form] DB Connection acquired.');

    const [result] = await connection.execute(sql, values); // Execute corrected SQL
    console.log('[API Career Form] MySQL Upsert Result:', result);

    // Check affected rows
    const affectedRows = (result as any)?.affectedRows ?? 0;
    // In MySQL ON DUPLICATE KEY UPDATE:
    // - Returns 1 if a row was inserted
    // - Returns 2 if an existing row was updated
    // - Returns 0 if an existing row was found but no values needed changing
    if (affectedRows > 0) {
         console.log(`[API Career Form] Form data ${affectedRows === 1 ? 'inserted' : 'updated'} successfully for user: ${userId}`);
    } else if ((result as any)?.warningStatus === 0) { // warningStatus might be relevant if no update occurred
         console.log('[API Career Form] No data changed for user:', userId);
    } else {
         console.warn('[API Career Form] Upsert completed but reported 0 affected rows.');
    }


    return NextResponse.json({ success: true, message: 'Form submitted successfully!' }, { status: 201 }); // Use 201 for consistency

  } catch (err: any) {
    console.error('[API Career Form] Error saving form data:', err);
    // Check specifically for SQL syntax errors
    if (err.code === 'ER_PARSE_ERROR' || err.errno === 1064) {
        console.error("!!! MySQL Syntax Error Detected !!!");
        console.error("SQL attempted:", sql); // Log the exact SQL
        console.error("Values attempted:", values); // Log the values
        return NextResponse.json({ error: 'Database syntax error processing form.', details: err.sqlMessage || err.message }, { status: 500 });
    }

    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred while saving the form.';
    if (err instanceof SyntaxError) { statusCode = 400; errorMessage = 'Invalid request body format.'; }
    else if (err.message) { errorMessage = err.message; }
    return NextResponse.json({ error: 'Failed to save form data.', details: errorMessage }, { status: statusCode });
  } finally {
      if (connection) {
         console.log('[API Career Form] MySQL connection released.');
         connection.release();
      } else {
          console.log("[API Career Form] No DB connection to release.");
      }
  }
}
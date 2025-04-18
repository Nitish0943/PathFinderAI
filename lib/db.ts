// lib/db.ts
import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null; // Initialize pool variable

const getPool = (): mysql.Pool => {
    if (pool) {
        // console.log('Reusing existing MySQL Connection Pool.');
        return pool;
    }

    console.log('Creating new MySQL Connection Pool...');
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
            // Add timezone for consistency, adjust as needed
            // timezone: '+00:00', // Example: UTC
        });

        // Optional: Add listeners for pool events (debugging)
        pool.on('acquire', function (connection) {
            console.log('MySQL Connection %d acquired', connection.threadId);
        });
        pool.on('release', function (connection) {
            console.log('MySQL Connection %d released', connection.threadId);
        });
        pool.on('error', function(err) {
             console.error('MySQL Pool Error:', err);
             // Handle fatal errors potentially by trying to re-create the pool?
             if (err.fatal) {
                 console.error("MySQL Pool encountered fatal error. Resetting pool variable.");
                 pool = null; // Allow re-creation on next call
             }
        });


        console.log('MySQL Connection Pool Created Successfully.');

        // Optional initial connection test (can remove in production)
        // pool.getConnection()
        //   .then(conn => {
        //     console.log('MySQL Test Connection Successful.');
        //     conn.release();
        //   })
        //   .catch(err => {
        //     console.error('!!! MySQL Test Connection Failed:', err);
        //   });

        return pool;

    } catch (error) {
        console.error('!!! CRITICAL: Failed to create MySQL Pool:', error);
        // In case of critical error during creation, ensure pool remains null
        pool = null;
        // Re-throw or handle appropriately for your application
        throw new Error("Failed to initialize database connection pool.");
    }
}

// Export a function that *gets* the pool, ensuring it's initialized
export const getDbPool = () => {
    if (!pool) {
        return getPool(); // Initialize if not already done
    }
    return pool;
};


// Keep the default export for compatibility if other files use it,
// but preferably use the named export getDbPool() going forward.
export default getPool(); // Initialize pool on first import
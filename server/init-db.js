const db = require('./db');

const initDb = async () => {
    try {
        console.log('[Database] Initializing schema...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('[Database] Table "users" verified/created successfully');
        process.exit(0);
    } catch (err) {
        console.error('[Database] Error initializing schema:', err);
        process.exit(1);
    }
};

initDb();

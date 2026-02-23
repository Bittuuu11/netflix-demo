const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
    console.error('[Database] CRITICAL ERROR: DATABASE_URL environment variable is missing.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => console.error('Pool Error:', err.message));

module.exports = {
    query: (text, params) => {
        console.log(`[Database Query] Executing: ${text.substring(0, 50)}...`);
        return pool.query(text, params);
    },
    pool
};

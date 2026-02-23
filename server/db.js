const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
    console.error('[Database] CRITICAL ERROR: DATABASE_URL environment variable is missing.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')) ? {
        rejectUnauthorized: false
    } : false
});

pool.on('connect', () => {
    console.log('[Database] Connected successfully');
});

pool.on('error', (err) => {
    console.error('[Database] Unexpected error on idle client', err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};

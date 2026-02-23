const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
        rejectUnauthorized: false
    }
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

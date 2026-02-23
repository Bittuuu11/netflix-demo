const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const db = require('./db');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// ─── Verification Routes ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// ─── Auth Routes ─────────────────────────────────────────────────────────

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ status_message: 'Email and password are required' });
        }

        // 1. Check if user already exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ status_message: 'User already exists' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into DB
        await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);

        console.log('[Auth] New user signed up:', email);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('[Auth Error]', err.message);
        res.status(500).json({ status_message: 'Error creating user' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ status_message: 'Email and password are required' });
        }

        // 1. Find user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ status_message: 'Invalid email or password' });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status_message: 'Invalid email or password' });
        }

        console.log('[Auth] User logged in:', email);
        res.json({ message: 'Login successful', user: { email: user.email } });
    } catch (err) {
        console.error('[Auth Error]', err.message);
        res.status(500).json({ status_message: 'Internal server error' });
    }
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../dist', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error('[Deployment] ❌ ERROR: index.html not found at:', indexPath);
        res.status(404).send('<h1>404 - Frontend Not Found</h1><p>The frontend files (dist) are missing. Please ensure the build command "npm run build" was executed successfully.</p>');
    }
});

// ─── Initialize Database & Start Server ───────────────────────────────────
const startServer = async () => {
    // 1. Immediately start listening to satisfy Render's health check
    console.log(`[Deployment] Initializing on Port: ${PORT}...`);
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`[Deployment] ✅ SUCCESS: Server is listening on port ${PORT}`);
        const distPath = path.join(__dirname, '../dist');
        console.log(`[Deployment] 📁 Serving frontend from: ${distPath}`);
        try {
            if (fs.existsSync(distPath)) {
                const files = fs.readdirSync(distPath);
                console.log(`[Deployment] 🔍 Dist folder contents: ${files.join(', ')}`);
            } else {
                console.error(`[Deployment] ❌ ERROR: Dist folder NOT FOUND at ${distPath}`);
            }
        } catch (e) {
            console.error(`[Deployment] ❌ ERROR: Failed to read dist folder: ${e.message}`);
        }
    });

    // 2. Attempt Database connection (Non-blocking for server startup)
    try {
        console.log('[Database] ⏳ Connecting to Aiven PostgreSQL...');
        if (!process.env.DATABASE_URL) {
            console.warn('[Database] ⚠️ WARNING: DATABASE_URL is not set. Auth features will be disabled.');
            return;
        }

        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('[Database] ✅ SUCCESS: Connected and schema verified.');
    } catch (err) {
        console.error('[Database] ❌ ERROR: Database connection failed. The app will remain live, but auth may not work.');
        console.error('[Database Trace]', err.message);
        // Note: We DO NOT process.exit(1) here anymore to keep the site "UP" on Render.
    }
};

startServer();

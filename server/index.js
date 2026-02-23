const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const db = require('./db');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 10000; // Render default

// ─── Emergency Error Handlers ─────────────────────────────────────────────
process.on('uncaughtException', (err) => {
    console.error(`💥 [CRITICAL] Uncaught Exception: ${err.message}`);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 [CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

// ─── Essential Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check (Highest Priority) ──────────────────────────────────────
app.get('/healthz', (req, res) => res.status(200).send('OK'));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }));

// ─── Startup Log ─────────────────────────────────────────────────────────
console.log(`[Deployment] Initializing startup sequence on port ${PORT}...`);

// ─── Static Files ────────────────────────────────────────────────────────
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// ─── Immediate Port Binding ──────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Deployment] Server is LIVE on port ${PORT}`);
    console.log(`📁 [Deployment] Serving assets from: ${distPath}`);
    if (!fs.existsSync(path.join(distPath, 'index.html'))) {
        console.error('❌ [Deployment] ALERT: index.html is missing in dist!');
    }
});

// Diagnostic Logger
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});

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

// ─── Initialize Database (Non-blocking) ───────────────────────────────────
const initDatabase = async () => {
    if (!process.env.DATABASE_URL) {
        console.warn('⚠️ [Database] No URL found. Auth will be disabled.');
        return;
    }
    try {
        console.log('⏳ [Database] Connecting to Aiven...');
        await db.query('SELECT 1');
        console.log('✅ [Database] Connected successfully.');
    } catch (err) {
        console.error('❌ [Database] Connection failed:', err.message);
    }
};

initDatabase();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('./db');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// ─── Verification Route ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
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
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
});

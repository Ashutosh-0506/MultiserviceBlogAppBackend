const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// Middleware to validate token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied. Token missing.');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).send('Invalid token.');
    }
};

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Input validation for username and password presence
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    // Password validation checks
    const passwordRequirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Check if the password meets all requirements
    if (!passwordRequirements.length) {
        return res.status(400).send('Password must be at least 8 characters long.');
    }
    if (!passwordRequirements.uppercase) {
        return res.status(400).send('Password must contain at least one uppercase letter.');
    }
    if (!passwordRequirements.lowercase) {
        return res.status(400).send('Password must contain at least one lowercase letter.');
    }
    if (!passwordRequirements.number) {
        return res.status(400).send('Password must contain at least one digit.');
    }
    if (!passwordRequirements.specialChar) {
        return res.status(400).send('Password must contain at least one special character.');
    }

    try {
        // Check if the username already exists
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).send('Username already exists.');
        }

        // Hash the password and save the user
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).send('User registered successfully.');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Error registering user.');
    }
});


// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    try {
        const userQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userQuery.rows.length === 0) {
            return res.status(400).send('User not found.');
        }

        const user = userQuery.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).send('Invalid credentials.');

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error logging in.');
    }
});

// Logout endpoint
router.post('/logout', verifyToken, (req, res) => {
    res.status(200).send('Logged out successfully.');
});

module.exports = router;

// routes/users.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get user details
router.get('/:id', async (req, res) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
        res.json(user.rows[0]);
    } catch (error) {
        res.status(500).send('Error fetching user');
    }
});

// Edit user details
router.put('/:id', async (req, res) => {
    const { username } = req.body;
    try {
        await pool.query('UPDATE users SET username = $1 WHERE id = $2', [username, req.params.id]);
        res.send('User updated');
    } catch (error) {
        res.status(500).send('Error updating user');
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
        res.send('User deleted');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});


// Health Check Route
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'User service is running',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;

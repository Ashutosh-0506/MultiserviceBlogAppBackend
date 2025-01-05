const express = require('express');
const pool = require('../db');
const router = express.Router();

// Define routes
router.post('/', async (req, res) => {
    const { content, post_id, author_id } = req.body;
    try {
        await pool.query('INSERT INTO comments (content, post_id, author_id) VALUES ($1, $2, $3)', [content, post_id, author_id]);
        res.status(201).send('Comment added');
    } catch (error) {
        res.status(500).send('Error adding comment');
    }
});

router.get('/', async (req, res) => {
    const { post_id } = req.query;
    try {
        const comments = await pool.query('SELECT * FROM comments WHERE post_id = $1', [post_id]);
        res.json(comments.rows);
    } catch (error) {
        res.status(500).send('Error fetching comments');
    }
});

module.exports = router; // Ensure the router is exported properly

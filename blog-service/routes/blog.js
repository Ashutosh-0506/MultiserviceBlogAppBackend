// routes/blogs.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Create a new blog post
router.post('/', async (req, res) => {
    const { title, content, author_id } = req.body;
    try {
        await pool.query('INSERT INTO blogs (title, content, author_id) VALUES ($1, $2, $3)', [title, content, author_id]);
        res.status(201).send('Blog created');
    } catch (error) {
        res.status(500).send('Error creating blog');
    }
});

// List all blog posts (with pagination)
router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const blogs = await pool.query('SELECT * FROM blogs LIMIT $1 OFFSET $2', [limit, offset]);
        res.json(blogs.rows);
    } catch (error) {
        res.status(500).send('Error fetching blogs');
    }
});

// Fetch a specific blog post
router.get('/:id', async (req, res) => {
    try {
        const blog = await pool.query('SELECT * FROM blogs WHERE id = $1', [req.params.id]);
        res.json(blog.rows[0]);
    } catch (error) {
        res.status(500).send('Error fetching blog');
    }
});

// Edit an existing blog post
router.put('/:id', async (req, res) => {
    const { title, content } = req.body;
    try {
        await pool.query('UPDATE blogs SET title = $1, content = $2 WHERE id = $3', [title, content, req.params.id]);
        res.send('Blog updated');
    } catch (error) {
        res.status(500).send('Error updating blog');
    }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM blogs WHERE id = $1', [req.params.id]);
        res.send('Blog deleted');
    } catch (error) {
        res.status(500).send('Error deleting blog');
    }
});

module.exports = router;

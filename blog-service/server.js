const express = require('express');
const blogRoutes = require('./routes/blog'); // Ensure this path matches your file structure
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/blogs', blogRoutes); // Register routes

const PORT = 4001;
app.listen(PORT, () => console.log(`Blog Service running on port ${PORT}`));

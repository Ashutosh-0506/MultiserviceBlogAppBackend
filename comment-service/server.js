const express = require('express');
const commentsRouter = require('./routes/comments');
const app = express();

app.use(express.json()); // Middleware to parse JSON
app.use('/comments', commentsRouter); // Attach the comments router

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
    console.log(`Comment Service running on port ${PORT}`);
});

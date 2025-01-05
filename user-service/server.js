const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(4000, () => {
    console.log('User Service running on port 4000');
});

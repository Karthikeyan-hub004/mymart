const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 9000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

// MongoDB connection
mongoose.connect('mongodb+srv://karthikeyankishore518:NzZWfVxS4S1P4iuy@cluster0.i61zv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// User schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    const user = new User({
        username,
        email,
        password
    });

    try {
        await user.save();
        res.redirect('/login'); // Redirect to login page after successful signup
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve index.html if login is successful
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' }); // Return JSON response for invalid credentials
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
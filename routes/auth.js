const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Prevent duplicate email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use.' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        res.status(201).json({ success: true, user: { name: user.name, email: user.email }, token });
    } catch (e) {
        console.error("Signup Error:", e);
        res.status(500).json({ success: false, message: 'Server error: ' + (e.message || 'Unknown database failure') });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[LOGIN API] Attempting login for email: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`[LOGIN API] User not found for email: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[LOGIN API] Password mismatch for email: ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        console.log(`[LOGIN API] Success for email: ${email}`);
        res.json({ success: true, user: { name: user.name, email: user.email }, token });
    } catch (e) {
        console.error("Login Error:", e);
        res.status(500).json({ success: false, message: 'Server error: ' + (e.message || 'Unknown database failure') });
    }
});

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client("1066704340738-apm8e4vvpmvepp9ona4pg225338c0usk.apps.googleusercontent.com");

// Google OAuth Login Route
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google ID Token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: "1066704340738-apm8e4vvpmvepp9ona4pg225338c0usk.apps.googleusercontent.com"
    });
    
    const payload = ticket.getPayload();
    const { email, name } = payload;
    
    // Check if user exists, otherwise create
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        password: "google-auth" // The pre-save hook will hash this dummy password
      });
      await user.save();
    }
    
    // Create internal JWT
    const jwtToken = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET
    );
    
    console.log(`[LOGIN API] Google OAuth Success for: ${email}`);
    res.json({
      success: true,
      token: jwtToken,
      user: { name: user.name, email: user.email }
    });
    
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(401).json({
      success: false,
      message: "Google authentication failed"
    });
  }
});

module.exports = router;

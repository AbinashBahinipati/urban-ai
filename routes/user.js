const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/user/profile
router.get('/profile', auth, async (req, res) => {
    try {
        const { name, email, createdAt } = req.user;
        res.send({ name, email, createdAt });
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;

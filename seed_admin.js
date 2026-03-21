require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        let admin = await User.findOne({ email: 'admin@urbancool.ai' });
        if (admin) {
            console.log('Admin user already exists. Updating password to admin123...');
            admin.password = 'admin123';
            await admin.save();
        } else {
            console.log('Creating new admin user...');
            admin = new User({
                name: 'System Administrator',
                email: 'admin@urbancool.ai',
                password: 'admin123'
            });
            await admin.save();
        }
        
        console.log('\n--- ADMIN ACCOUNT READY ---');
        console.log('Email: admin@urbancool.ai');
        console.log('Password: admin123');
        console.log('---------------------------\n');
        process.exit();
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB. Is your cluster running and your URI correct?', err.message);
        process.exit(1);
    });

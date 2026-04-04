import mongoose from 'mongoose';
import User from './models/User.js';

mongoose.connect('mongodb://localhost:27017/devgap')
  .then(async () => {
    try {
      let user = await User.findOne({ email: 'admin@devgap.ai' });
      if (!user) {
        user = new User({
          name: 'Guest User',
          email: 'admin@devgap.ai',
          password: 'Password123!',
        });
        await user.save();
        console.log('User created successfully. Email: admin@devgap.ai, Password: Password123!');
      } else {
        user.password = 'Password123!';
        await user.save();
        console.log('User already exists, password updated. Email: admin@devgap.ai, Password: Password123!');
      }
    } catch (e) {
      console.error('Error inserting user:', e);
    } finally {
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });

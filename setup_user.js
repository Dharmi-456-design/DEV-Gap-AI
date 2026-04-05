import mongoose from 'mongoose';
import User from './backend/models/User.js';

const MONGO_URI = 'mongodb://localhost:27017/devgap';

async function setup() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'kananiyashvi707@gmail.com';
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: 'Yashvi Kanani',
        email: email,
        password: 'password123',
      });
      await user.save();
      console.log(`User created: ${email} / password123`);
    } else {
      user.password = 'password123';
      await user.save();
      console.log(`User updated: ${email} / password123`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.disconnect();
  }
}

setup();

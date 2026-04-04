import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import asyncHandler from 'express-async-handler';

// @desc    Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log(`[AUTH] Registration attempt for email: ${email}`);

  const userExists = await User.findOne({ email });
  if (userExists) {
    console.warn(`[AUTH] Registration failed: Email ${email} already exists`);
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    console.log(`[AUTH] User created successfully: ${user._id}`);
    
    // Create professional profile for the user
    await Profile.create({ user: user._id });
    console.log(`[AUTH] Profile created for user: ${user._id}`);

    const token = generateToken(user._id);
    console.log(`[AUTH] Token generated for user: ${user._id}`);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    console.error(`[AUTH] User creation failed for email: ${email}`);
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log(`[AUTH] Login attempt for email: ${email}`);

  const user = await User.findOne({ email });

  if (!user) {
    console.warn(`[AUTH] Login failed: User not found for email ${email}`);
    res.status(401);
    throw new Error('Invalid email or password');
  }

  console.log(`[AUTH] User found: ${user._id}. Verifying password...`);
  
  const isMatch = await user.matchPassword(password);

  if (isMatch) {
    console.log(`[AUTH] Password matched for user: ${user._id}`);
    const token = generateToken(user._id);
    console.log(`[AUTH] Token generated successfully`);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    console.warn(`[AUTH] Login failed: Incorrect password for user ${user._id}`);
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  console.log(`[AUTH] Fetching current user profile for ID: ${req.user._id}`);
  
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    console.error(`[AUTH] User not found during profile fetch for ID: ${req.user._id}`);
    res.status(404);
    throw new Error('User not found');
  }
});

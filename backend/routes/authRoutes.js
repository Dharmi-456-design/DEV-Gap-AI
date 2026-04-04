import express from 'express';
import { body, validationResult } from 'express-validator';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn(`[VALIDATION] Registration or Login failed: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for registration
const registerValidation = [
  body('name', 'Name is required').notEmpty().trim(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

// Validation rules for login
const loginValidation = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists(),
];

// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerValidation, validate, registerUser);

// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginValidation, validate, loginUser);

// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getMe);

export default router;

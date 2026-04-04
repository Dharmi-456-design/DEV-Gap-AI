import express from 'express';
import Profile from '../models/Profile.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email avatar');
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  res.json(profile);
});

router.put('/', protect, async (req, res) => {
  const fields = ['bio', 'location', 'githubUsername', 'linkedinUrl', 'portfolioUrl', 'targetRole', 'experience', 'education', 'skills'];
  const update = {};
  fields.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
  update.updatedAt = new Date();
  const profile = await Profile.findOneAndUpdate({ user: req.user._id }, update, { new: true, upsert: true });
  res.json(profile);
});

export default router;

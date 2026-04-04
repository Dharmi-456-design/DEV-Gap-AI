import express from 'express';
import Analytics from '../models/Analytics.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/track', protect, async (req, res) => {
  const { action } = req.body;
  await Analytics.findOneAndUpdate(
    { user: req.user._id },
    { $push: { actionsPerformed: { action, timestamp: new Date() } }, $set: { lastLogin: new Date() } },
    { upsert: true }
  );
  res.json({ tracked: true });
});

router.get('/', protect, async (req, res) => {
  const analytics = await Analytics.findOne({ user: req.user._id });
  res.json(analytics || { loginCount: 0, actionsPerformed: [] });
});

export default router;

import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loginCount: { type: Number, default: 0 },
  lastLogin: { type: Date },
  pagesVisited: [String],
  actionsPerformed: [{ action: String, timestamp: Date }],
});

export default mongoose.model('Analytics', analyticsSchema);

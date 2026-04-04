import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  githubUsername: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },
  devGapScore: { type: Number, default: 0 },
  skills: [{ name: String, level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] } }],
  targetRole: { type: String, default: '' },
  experience: { type: String, default: '0' },
  education: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Profile', profileSchema);

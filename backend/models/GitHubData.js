import mongoose from 'mongoose';

const githubDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  avatarUrl: { type: String },
  bio: { type: String },
  publicRepos: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  totalStars: { type: Number, default: 0 },
  languages: { type: Map, of: Number },
  topRepos: [{ name: String, description: String, stars: Number, forks: Number, language: String, url: String }],
  activityScore: { type: Number, default: 0 },
  portfolioScore: { type: Number, default: 0 },
  skills: {
    frontend: [{ type: String }],
    backend: [{ type: String }],
    tools: [{ type: String }]
  },
  activeRepos: { type: Number, default: 0 },
  insights: [{ type: String }],
  weaknesses: [{ type: String }],
  recommendations: [{ type: String }],
  verdict: { type: String },
  analyzedAt: { type: Date, default: Date.now },
});

export default mongoose.model('GitHubData', githubDataSchema);

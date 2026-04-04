import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String },
  originalName: { type: String },
  extractedText: { type: String, default: '' },
  extractedSkills: [String],
  groupedSkills: {
    frontend: [String],
    backend: [String],
    database: [String],
    tools: [String]
  },
  resumeScore: { type: Number, default: 0 },
  realityCheck: { type: String },
  missingSkills: [String],
  projectQuality: {
    score: { type: Number, default: 0 },
    issues: [String]
  },
  jobReadiness: { type: String },
  improvements: [String],
  recruiterVerdict: {
    hire: { type: Boolean },
    reason: { type: String }
  },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Resume', resumeSchema);

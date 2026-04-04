import mongoose from 'mongoose';

const careerDecisionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bestPath: { type: String },
  avoidPaths: [String],
  reasoning: { type: String },
  skillGaps: [{ skill: String, priority: String, estimatedTime: String }],
  timeRequired: { type: String },
  confidencePercent: { type: Number },
  failureRisk: { type: String, enum: ['low', 'medium', 'high'] },
  failureReasons: [String],
  successFactors: [String],
  regretScore: { type: Number },
  wrongPathConsequences: [String],
  rightPathOutcomes: [String],
  jobEligible: { type: Boolean, default: false },
  eligibilityScore: { type: Number, default: 0 },
  missingForJob: [String],
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('CareerDecision', careerDecisionSchema);

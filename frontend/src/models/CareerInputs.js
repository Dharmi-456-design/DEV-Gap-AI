import mongoose from 'mongoose';

const careerInputsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  primaryGoal: { type: String, enum: ['salary', 'passion', 'fast_job', 'stability'], default: 'salary' },
  interest: { type: String, enum: ['coding', 'design', 'communication', 'management'], default: 'coding' },
  communicationLevel: { type: Number, min: 1, max: 10, default: 5 },
  confidenceLevel: { type: Number, min: 1, max: 10, default: 5 },
  riskTolerance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  patienceLevel: { type: Number, min: 1, max: 10, default: 5 },
  workPreference: { type: String, enum: ['remote', 'hybrid', 'onsite'], default: 'hybrid' },
  currentSituation: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('CareerInputs', careerInputsSchema);

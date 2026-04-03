import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String },
  mentorGreeting: { type: String },
  phases: [{
    phase: Number,
    title: String,
    duration: String,
    mentorMessage: String,
    tasks: [{
      category: { type: String, enum: ['coding', 'communication', 'project', 'real_world'] },
      task: String,
      resource: String,
      completed: { type: Boolean, default: false },
    }],
    practiceLinks: [{ name: String, url: String, type: String, description: String, platform: String }],
    interviewQuestions: [{ question: String, url: String, platform: String }],
  }],
  overallProgress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Roadmap', roadmapSchema);

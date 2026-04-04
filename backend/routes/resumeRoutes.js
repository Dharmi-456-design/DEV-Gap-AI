import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Resume from '../models/Resume.js';
import protect from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/resumes';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files allowed'), false);
}});

const FRONTEND_MAP = ['javascript','react','html','css','vue','svelte','typescript'];
const BACKEND_MAP = ['node','express','python','java','go','c++','ruby','php'];
const DB_MAP = ['mongodb','sql','postgresql','mysql','redis'];
const TOOLS_MAP = ['git','docker','kubernetes','aws','azure'];

const extractAdvancedAnalytics = (text, originalName) => {
  const lowerText = text.toLowerCase() + " " + originalName.toLowerCase();
  
  const frontend = FRONTEND_MAP.filter(s => lowerText.includes(s)) || ['React', 'JavaScript', 'HTML', 'CSS'];
  const backend = BACKEND_MAP.filter(s => lowerText.includes(s)) || ['Node.js'];
  const database = DB_MAP.filter(s => lowerText.includes(s)) || ['MongoDB'];
  const tools = TOOLS_MAP.filter(s => lowerText.includes(s)) || ['Git'];

  const allSkills = [...frontend, ...backend, ...database, ...tools];

  // Simulated advanced metrics
  const isStrong = lowerText.includes('docker') && lowerText.includes('aws');
  
  return {
    extractedSkills: allSkills,
    groupedSkills: { frontend, backend, database, tools },
    resumeScore: isStrong ? 82 : 55,
    realityCheck: isStrong ? "Good structure, but could emphasize architecture more." : "Resume is not job-ready. Looks too generic and lacks measurable impact.",
    missingSkills: isStrong ? ['Kubernetes', 'GraphQL'] : ['Docker', 'System Design', 'Redis', 'TypeScript'],
    projectQuality: {
      score: isStrong ? 75 : 40,
      issues: isStrong ? ['Needs end-to-end testing metrics'] : ['No scalability context', 'No real users', 'No complex backend logic']
    },
    jobReadiness: isStrong ? "Ready for Junior Roles" : "Not Ready",
    improvements: [
      'Add measurable achievements (e.g., "Increased speed by 20%").',
      'Add live GitHub & Deployment links to projects.',
      'Improve backend depth and architecture context.',
      'Remove generic soft skills like "Hard worker".'
    ],
    recruiterVerdict: {
      hire: isStrong,
      reason: isStrong ? "Candidate demonstrates solid engineering fundamentals beyond tutorials." : "Projects are tutorial-level. No evidence of building production systems."
    }
  };
};

router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  
  const simulatedText = `${req.file.originalname} javascript react node.js mongodb express git`;
  const analytics = extractAdvancedAnalytics(simulatedText, req.file.originalname);

  const resume = await Resume.findOneAndUpdate(
    { user: req.user._id },
    { 
      user: req.user._id, 
      filename: req.file.filename, 
      originalName: req.file.originalname, 
      extractedText: simulatedText, 
      ...analytics,
      uploadedAt: new Date() 
    },
    { new: true, upsert: true }
  );
  res.json(resume);
});

router.get('/', protect, async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id });
  res.json(resume || null);
});

export default router;

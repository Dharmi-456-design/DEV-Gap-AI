import express from 'express';
import CareerInputs from '../models/CareerInputs.js';
import CareerDecision from '../models/CareerDecision.js';
import GitHubData from '../models/GitHubData.js';
import Resume from '../models/Resume.js';
import Profile from '../models/Profile.js';
import protect from '../middleware/auth.js';

const router = express.Router();

const CAREER_PATHS = {
  fullstack: { title: 'Full-Stack Developer', salaryRange: '$70k-$130k', demand: 'Very High', time: '6-12 months' },
  frontend: { title: 'Frontend Developer', salaryRange: '$60k-$110k', demand: 'High', time: '4-8 months' },
  backend: { title: 'Backend Engineer', salaryRange: '$75k-$140k', demand: 'High', time: '6-10 months' },
  devops: { title: 'DevOps Engineer', salaryRange: '$90k-$160k', demand: 'Very High', time: '8-14 months' },
  ml: { title: 'ML Engineer', salaryRange: '$100k-$180k', demand: 'Very High', time: '12-24 months' },
  designer: { title: 'UI/UX Designer', salaryRange: '$55k-$100k', demand: 'Medium', time: '3-6 months' },
  pm: { title: 'Product Manager', salaryRange: '$80k-$150k', demand: 'High', time: '12-18 months' },
};

const calculateCareerDecision = (inputs, github, resume, profile) => {
  const skills = resume?.extractedSkills || [];
  const langs = github ? Object.keys(github.languages || {}) : [];
  const portfolioScore = github?.portfolioScore || 0;
  const activityScore = github?.activityScore || 0;

  // Calculate skill gaps
  const fullstackSkills = ['javascript', 'react', 'node', 'mongodb', 'express', 'css', 'html', 'git'];
  const mlSkills = ['python', 'machine learning', 'tensorflow', 'pytorch', 'deep learning'];
  const devopsSkills = ['docker', 'kubernetes', 'aws', 'linux', 'git', 'ci/cd'];

  const userSkillSet = [...skills, ...langs.map(l => l.toLowerCase())];

  const fullstackGap = fullstackSkills.filter(s => !userSkillSet.includes(s));
  const mlGap = mlSkills.filter(s => !userSkillSet.includes(s));
  const devopsGap = devopsSkills.filter(s => !userSkillSet.includes(s));

  let bestPath, avoidPaths, timeRequired, confidencePercent;

  if (inputs.interest === 'coding' && inputs.primaryGoal === 'salary') {
    if (mlGap.length < 3 && inputs.patienceLevel > 6) {
      bestPath = CAREER_PATHS.ml.title;
      timeRequired = CAREER_PATHS.ml.time;
      confidencePercent = Math.max(40, 80 - mlGap.length * 8);
      avoidPaths = [CAREER_PATHS.designer.title];
    } else {
      bestPath = CAREER_PATHS.fullstack.title;
      timeRequired = CAREER_PATHS.fullstack.time;
      confidencePercent = Math.max(50, 90 - fullstackGap.length * 6);
      avoidPaths = [CAREER_PATHS.designer.title, CAREER_PATHS.pm.title];
    }
  } else if (inputs.interest === 'design') {
    bestPath = CAREER_PATHS.designer.title;
    timeRequired = CAREER_PATHS.designer.time;
    confidencePercent = 75;
    avoidPaths = [CAREER_PATHS.devops.title];
  } else if (inputs.primaryGoal === 'fast_job') {
    bestPath = CAREER_PATHS.frontend.title;
    timeRequired = CAREER_PATHS.frontend.time;
    confidencePercent = Math.max(55, 85 - (10 - inputs.confidenceLevel) * 3);
    avoidPaths = [CAREER_PATHS.ml.title, CAREER_PATHS.devops.title];
  } else if (inputs.interest === 'communication' || inputs.communicationLevel > 7) {
    bestPath = CAREER_PATHS.pm.title;
    timeRequired = CAREER_PATHS.pm.time;
    confidencePercent = 70;
    avoidPaths = [CAREER_PATHS.devops.title];
  } else {
    bestPath = CAREER_PATHS.backend.title;
    timeRequired = CAREER_PATHS.backend.time;
    confidencePercent = 72;
    avoidPaths = [CAREER_PATHS.designer.title];
  }

  // Risk calc
  const riskFactors = [];
  if (inputs.confidenceLevel < 4) riskFactors.push('Low confidence may hinder interviews');
  if (inputs.riskTolerance === 'low' && bestPath === CAREER_PATHS.ml.title) riskFactors.push('ML path requires high risk tolerance');
  if (portfolioScore < 30) riskFactors.push('Weak portfolio reduces hiring chances');
  if (activityScore < 20) riskFactors.push('Low GitHub activity signals low coding consistency');
  if (inputs.patienceLevel < 4 && timeRequired.includes('12')) riskFactors.push('Impatience vs long preparation time mismatch');

  const failureRisk = riskFactors.length >= 3 ? 'high' : riskFactors.length >= 1 ? 'medium' : 'low';
  const regretScore = Math.round((10 - inputs.patienceLevel) * 8 + (10 - inputs.confidenceLevel) * 5);

  const skillGaps = fullstackGap.slice(0, 5).map(s => ({
    skill: s, priority: 'high', estimatedTime: '2-3 weeks'
  }));

  const eligibilityScore = Math.round((portfolioScore * 0.3) + (activityScore * 0.3) + (skills.length * 3) + (confidencePercent * 0.4));
  const jobEligible = eligibilityScore >= 60;

  const missingForJob = [];
  if (!skills.includes('javascript')) missingForJob.push('Strong JavaScript fundamentals');
  if (portfolioScore < 50) missingForJob.push('2+ deployed projects on GitHub');
  if (activityScore < 30) missingForJob.push('Consistent coding activity (daily commits)');
  if (inputs.communicationLevel < 5) missingForJob.push('Communication & interview skills');

  return {
    bestPath,
    avoidPaths,
    reasoning: `Based on your ${inputs.interest} interest and goal of ${inputs.primaryGoal}, combined with ${skills.length} detected skills and a portfolio score of ${portfolioScore}/100, ${bestPath} is your optimal trajectory. Your ${inputs.riskTolerance} risk tolerance and patience level of ${inputs.patienceLevel}/10 further validates this recommendation.`,
    skillGaps,
    timeRequired,
    confidencePercent: Math.min(confidencePercent, 97),
    failureRisk,
    failureReasons: riskFactors,
    successFactors: [
      'Consistent daily practice (1-2 hours minimum)',
      'Build 3+ real-world projects',
      'Engage with developer communities',
      'Apply to 5+ jobs weekly after milestone 2',
    ],
    regretScore: Math.min(regretScore, 100),
    wrongPathConsequences: [
      `Choosing ${avoidPaths[0] || 'wrong path'} would waste 6-18 months`,
      'Misalignment with natural strengths causes frustration',
      'Lower salary ceiling due to interest-work mismatch',
    ],
    rightPathOutcomes: [
      `${bestPath} roles start at $65k-$90k entry level`,
      `Promotion to senior in 2-3 years can reach $150k+`,
      `High demand market with ${Object.keys(CAREER_PATHS).length}+ daily openings`,
    ],
    jobEligible,
    eligibilityScore: Math.min(eligibilityScore, 100),
    missingForJob,
  };
};

router.post('/inputs', protect, async (req, res) => {
  const inputs = await CareerInputs.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, ...req.body, updatedAt: new Date() },
    { new: true, upsert: true }
  );
  res.json(inputs);
});

router.get('/inputs', protect, async (req, res) => {
  const inputs = await CareerInputs.findOne({ user: req.user._id });
  res.json(inputs || null);
});

router.post('/analyze', protect, async (req, res) => {
  const [inputs, github, resume, profile] = await Promise.all([
    CareerInputs.findOne({ user: req.user._id }),
    GitHubData.findOne({ user: req.user._id }),
    Resume.findOne({ user: req.user._id }),
    Profile.findOne({ user: req.user._id }),
  ]);
  if (!inputs) return res.status(400).json({ message: 'Complete career intent form first' });

  const result = calculateCareerDecision(inputs, github, resume, profile);
  const decision = await CareerDecision.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, ...result, generatedAt: new Date() },
    { new: true, upsert: true }
  );

  // Update profile devGapScore
  await Profile.findOneAndUpdate({ user: req.user._id }, { devGapScore: result.confidencePercent });

  res.json(decision);
});

router.get('/decision', protect, async (req, res) => {
  const decision = await CareerDecision.findOne({ user: req.user._id });
  res.json(decision || null);
});

router.get('/trends', protect, async (req, res) => {
  res.json({
    trendingSkills: [
      { skill: 'AI/ML Engineering', growth: '+340%', salary: '$130k-$200k', difficulty: 'Hard' },
      { skill: 'Full-Stack (React+Node)', growth: '+180%', salary: '$90k-$150k', difficulty: 'Medium' },
      { skill: 'DevOps / Cloud', growth: '+220%', salary: '$100k-$170k', difficulty: 'Hard' },
      { skill: 'Cybersecurity', growth: '+290%', salary: '$110k-$180k', difficulty: 'Hard' },
      { skill: 'Mobile Dev (React Native)', growth: '+150%', salary: '$80k-$140k', difficulty: 'Medium' },
      { skill: 'UI/UX Design', growth: '+120%', salary: '$70k-$120k', difficulty: 'Easy' },
      { skill: 'Blockchain/Web3', growth: '+95%', salary: '$100k-$200k', difficulty: 'Very Hard' },
      { skill: 'Data Engineering', growth: '+200%', salary: '$110k-$160k', difficulty: 'Hard' },
    ],
    topEmergingRoles: [
      'AI Prompt Engineer', 'LLM Fine-tuner', 'MLOps Engineer', 'Platform Engineer', 'Developer Advocate'
    ],
    dyingRoles: ['Manual QA Tester', 'WordPress Developer', 'Flash Developer', 'Basic SEO Specialist'],
  });
});

export default router;

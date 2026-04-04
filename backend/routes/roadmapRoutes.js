import express from 'express';
import Roadmap from '../models/Roadmap.js';
import CareerDecision from '../models/CareerDecision.js';
import protect from '../middleware/auth.js';

const router = express.Router();

const generateRoadmapData = (targetRole, decision) => {
  const roleMap = {
    'Full-Stack Developer': {
      mentorGreeting: "So you want to be a Full-Stack Developer. Everyone does. The difference between the 90% who fail and the 10% who get hired is consistency. Here is your brutal, no-nonsense roadmap. Do not skip steps.",
      phases: [
        {
          phase: 1, title: 'The Reality Check (Foundation)', duration: 'Weeks 1-4',
          mentorMessage: "Start here. Not with React. Not with Node. You start with HTML, CSS, and basic JavaScript. If you can't build a page from scratch without AI, you aren't ready to move on. Build the muscle memory.",
          tasks: [
            { category: 'coding', task: 'Build 3 static websites using pure HTML & CSS (No frameworks, no Tailwind).', resource: 'MDN Web Docs' },
            { category: 'coding', task: 'Master JS data structures (Objects, Arrays) and loops. Don\'t move on until this makes sense.', resource: 'javascript.info' },
            { category: 'real_world', task: 'Code at least 2 hours every single day. Track it. If you miss a day, start over.', resource: 'Habit Tracker' },
            { category: 'communication', task: 'Explain what a DOM is to a non-technical friend. If they don\'t get it, you don\'t get it.', resource: 'Real Human Conversation' },
          ],
          practiceLinks: [
            { name: 'HackerRank JS', url: 'https://www.hackerrank.com/domains/javascript', description: 'Solve fundamental Web / JS algorithm challenges.', platform: 'HackerRank' },
            { name: 'SoloLearn Basics', url: 'https://www.sololearn.com/learn/HTML', description: 'Interactive bitesize learning for HTML & CSS.', platform: 'SoloLearn' }
          ],
          interviewQuestions: [
            { question: 'Solve "Simple Array Sum"', url: 'https://www.hackerrank.com/challenges/simple-array-sum/problem', platform: 'HackerRank' },
            { question: 'Complete HTML Elements Basics', url: 'https://www.sololearn.com/learn/HTML', platform: 'SoloLearn' },
            { question: 'Solve "Let and Const" challenge', url: 'https://www.hackerrank.com/challenges/js10-let-and-const/problem', platform: 'HackerRank' }
          ],
        },
        {
          phase: 2, title: 'The Breaking Point (Logic & React)', duration: 'Weeks 5-10',
          mentorMessage: "This is where most people quit. React is going to feel confusing. Promises will break your brain. Don't panic. Sit in the confusion. Write bad code until it makes sense.",
          tasks: [
            { category: 'coding', task: 'Master JS Async/Await, Promises, and fetch API. Build a weather app.', resource: 'MDN / FreeCodeCamp' },
            { category: 'coding', task: 'Build 5 small React apps using useState and useEffect. Do not copy paste.', resource: 'React Docs' },
            { category: 'project', task: 'Build a fully functional E-commerce UI (Cart, State, Filtering) in React.', resource: 'Personal Project' },
            { category: 'real_world', task: 'Manage Burnout: Take 1 full day off per week. No screen time. Save your brain.', resource: 'Rest' },
          ],
          practiceLinks: [
            { name: 'LeetCode DSA', url: 'https://leetcode.com/problemset/javascript/', description: 'Practice data structures and arrays using JS.', platform: 'LeetCode' },
            { name: 'HackerRank Logic', url: 'https://www.hackerrank.com/challenges/js10-loops/problem', description: 'Strengthen control flow and asynchronous logic.', platform: 'HackerRank' }
          ],
          interviewQuestions: [
            { question: 'Solve "10 Days of JS: Loops"', url: 'https://www.hackerrank.com/challenges/js10-loops/problem', platform: 'HackerRank' },
            { question: 'Complete React Components Lesson', url: 'https://www.sololearn.com/learn/React', platform: 'SoloLearn' },
            { question: 'Solve "10 Days of JS: Arrow Functions"', url: 'https://www.hackerrank.com/challenges/js10-arrows/problem', platform: 'HackerRank' },
          ],
        },
        {
          phase: 3, title: 'The Backend Engine', duration: 'Weeks 11-16',
          mentorMessage: "Frontend is pretty, but backend runs the business. Node.js, Express, and Databases. You will learn how data actually moves. Secure your APIs.",
          tasks: [
            { category: 'coding', task: 'Build a REST API from scratch using Node.js & Express.', resource: 'Express Docs' },
            { category: 'coding', task: 'Connect a MongoDB database. Perform CRUD operations via Postman.', resource: 'Mongoose Docs' },
            { category: 'project', task: 'Write authentication (JWT). If you can authenticate users securely, you are hirable.', resource: 'Security Docs' },
            { category: 'communication', task: 'Write documentation (README) for your API that another human can actually read.', resource: 'Markdown' },
          ],
          practiceLinks: [
            { name: 'HackerRank Backend', url: 'https://www.hackerrank.com/skills-verification/node_js_basic', description: 'Test standard Node.js server architecture logic.', platform: 'HackerRank' },
            { name: 'SoloLearn Databases', url: 'https://www.sololearn.com/learn/SQL', description: 'Master NoSQL and traditional database querying.', platform: 'SoloLearn' }
          ],
          interviewQuestions: [
            { question: 'Solve "Basic REST API using Node"', url: 'https://www.hackerrank.com/skills-verification/node_js_basic', platform: 'HackerRank' },
            { question: 'Complete SQL & Database Basics', url: 'https://www.sololearn.com/learn/SQL', platform: 'SoloLearn' },
            { question: 'Solve "10 Days of JS: Classes"', url: 'https://www.hackerrank.com/challenges/js10-class/problem', platform: 'HackerRank' },
          ],
        },
        {
          phase: 4, title: 'Prove It (Portfolio & Job Hunt)', duration: 'Weeks 17-20',
          mentorMessage: "Certificates are useless. Nobody cares about your Udemy badge. They care about what you can demonstrate. Deploy your full stack apps and start failing interviews until you pass one.",
          tasks: [
            { category: 'real_world', task: 'Deploy your Full-Stack app to Vercel/Render. Ensure it works live.', resource: 'Vercel / Render' },
            { category: 'project', task: 'Build a portfolio site that isn\'t a generic template. Host it on your own domain.', resource: 'Personal Branding' },
            { category: 'communication', task: 'Do 5 mock interviews. You will sound stupid on the first 3. That is normal.', resource: 'Pramp' },
            { category: 'real_world', task: 'Apply to 10 jobs daily. Ignore "3 years experience req". Apply anyway.', resource: 'LinkedIn' },
          ],
          practiceLinks: [
            { name: 'LeetCode Blind 75', url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions', description: 'The legendary top 75 interview prep questions.', platform: 'LeetCode' },
            { name: 'HackerRank React', url: 'https://www.hackerrank.com/skills-verification/react_basic', description: 'Industry standard Frontend assessment mock tests.', platform: 'HackerRank' }
          ],
          interviewQuestions: [
            { question: 'Solve "React Frontend Challenge"', url: 'https://www.hackerrank.com/skills-verification/react_basic', platform: 'HackerRank' },
            { question: 'Solve "Problem Solving (Basic)"', url: 'https://www.hackerrank.com/skills-verification/problem_solving_basic', platform: 'HackerRank' },
            { question: 'Complete Final Best Practices', url: 'https://www.sololearn.com/', platform: 'SoloLearn' },
          ],
        },
      ],
    },
  };

  return roleMap['Full-Stack Developer'] || roleMap['Full-Stack Developer'];
};

router.post('/generate', protect, async (req, res) => {
  const decision = await CareerDecision.findOne({ user: req.user._id });
  const targetRole = decision?.bestPath || req.body.targetRole || 'Full-Stack Developer';
  const roadmapData = generateRoadmapData(targetRole, decision);

  const roadmap = await Roadmap.findOneAndUpdate(
    { user: req.user._id },
    { 
      user: req.user._id, 
      targetRole, 
      mentorGreeting: roadmapData.mentorGreeting,
      phases: roadmapData.phases, 
      overallProgress: 0, 
      createdAt: new Date() 
    },
    { new: true, upsert: true }
  );
  res.json(roadmap);
});

router.get('/', protect, async (req, res) => {
  const roadmap = await Roadmap.findOne({ user: req.user._id });
  res.json(roadmap || null);
});

router.patch('/task', protect, async (req, res) => {
  const { phaseIndex, taskIndex, completed } = req.body;
  const roadmap = await Roadmap.findOne({ user: req.user._id });
  if (!roadmap) return res.status(404).json({ message: 'No roadmap found' });

  roadmap.phases[phaseIndex].tasks[taskIndex].completed = completed;
  const total = roadmap.phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const done = roadmap.phases.reduce((acc, p) => acc + p.tasks.filter(t => t.completed).length, 0);
  roadmap.overallProgress = Math.round((done / total) * 100);

  await roadmap.save();
  res.json(roadmap);
});

export default router;

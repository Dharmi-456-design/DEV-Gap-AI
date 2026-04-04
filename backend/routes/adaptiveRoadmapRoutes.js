import express from 'express';
import protect from '../middleware/auth.js';
import CareerDecision from '../models/CareerDecision.js';
import CareerInputs from '../models/CareerInputs.js';
import Resume from '../models/Resume.js';
import Profile from '../models/Profile.js';
import GitHubData from '../models/GitHubData.js';

const router = express.Router();

const determineWeakTopics = (skills, role) => {
  const weak = [];
  const lowerSkills = skills.map(s => s.toLowerCase());
  if (role.includes('Full-Stack') || role.includes('Frontend')) {
    if (!lowerSkills.includes('html') || !lowerSkills.includes('css')) weak.push('HTML/CSS Fundamentals');
    if (!lowerSkills.includes('javascript') || !lowerSkills.includes('javascript (es6+)')) weak.push('JavaScript Core');
  }
  if (role.includes('Backend')) {
    if (!lowerSkills.includes('node.js') && !lowerSkills.includes('python')) weak.push('Backend Logic');
    if (!lowerSkills.includes('sql') && !lowerSkills.includes('mongodb')) weak.push('Database Design');
  }
  return weak.length ? weak : ['Basic Core Syntax', 'Git/Version Control'];
};

const getMissingSkills = (skills, role) => {
    // simplified missing skills logic
    const reqs = {
      'Full-Stack Developer': ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'],
      'Frontend Developer': ['React', 'TypeScript', 'Tailwind', 'Next.js'],
      'Backend Engineer': ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
      'AI/ML Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Data Structures'],
    };
    
    const roleReqs = reqs[role] || reqs['Full-Stack Developer'];
    const lowerSkills = skills.map(s => s.toLowerCase());
    return roleReqs.filter(r => !lowerSkills.includes(r.toLowerCase()));
};

router.post('/generate', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch user context
    const [decision, profile, resume, githubData, inputs] = await Promise.all([
      CareerDecision.findOne({ user: userId }),
      Profile.findOne({ user: userId }),
      Resume.findOne({ user: userId }),
      GitHubData.findOne({ user: userId }),
      CareerInputs.findOne({ user: userId })
    ]);

    const targetRole = decision?.bestPath || req.body.career_goal || 'Full-Stack Developer';
    const devGapScore = profile?.devGapScore || decision?.eligibilityScore || 45;
    
    const extractedSkills = resume?.extractedSkills || [];
    const weakTopics = determineWeakTopics(extractedSkills, targetRole);
    const missingSkills = getMissingSkills(extractedSkills, targetRole);

    const phases = [
      {
        phase_number: 1,
        phase_title: 'Fix Your Weak Foundations',
        mentor_advice: `I looked at your profile. Your fundamentals are weak in ${weakTopics.join(' and ')}. Before you touch any framework, you must fix this. Don't skip this phase. Most students fail interviews because of weak fundamentals.`,
        tasks: [
          `Learn core concepts of ${weakTopics[0]}`,
          'Build 2 small UI/logic projects without tutorials',
          'Practice layout systems and DOM manipulation or core API routing'
        ],
        resources: {
          youtube_video: { title: `${weakTopics[0]} Crash Course`, url: 'https://youtube.com/results?search_query=' + encodeURIComponent(weakTopics[0] + ' crash course') },
          practice_links: [
            { name: 'SoloLearn', url: 'https://sololearn.com' },
            { name: 'FreeCodeCamp', url: 'https://freecodecamp.org' }
          ]
        }
      },
      {
        phase_number: 2,
        phase_title: 'Build Real Projects',
        mentor_advice: `Now start building projects that simulate real company work. Stop watching tutorials. Build a full system end-to-end to learn how these missing skills fit together: ${missingSkills.slice(0, 3).join(', ')}.`,
        tasks: [
          'Build a REST API from scratch',
          'Add secure JWT authentication',
          'Connect to a real database (MongoDB / PostgreSQL)',
          'Deploy the API so it is publicly accessible'
        ],
        resources: {
          youtube_video: { title: 'REST API Best Practices', url: 'https://youtube.com/results?search_query=REST+API+Best+Practices' },
          practice_links: [
            { name: 'GitHub Architecture Examples', url: 'https://github.com' }
          ]
        }
      },
      {
        phase_number: 3,
        phase_title: 'Industry-Level Skills',
        mentor_advice: `You can build apps, now you need to build them like a professional. Companies look for these skills to distinguish juniors from interns.`,
        tasks: [
          'System Design Basics',
          'Implement Caching (Redis)',
          'Learn basic CI/CD (GitHub Actions)',
          'Optimization & Performance Tuning'
        ],
        resources: {
          youtube_video: { title: 'System Design for Beginners', url: 'https://youtube.com/results?search_query=System+design+for+beginners' },
          practice_links: [
            { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' }
          ]
        }
      },
      {
        phase_number: 4,
        phase_title: 'Interview Preparation',
        mentor_advice: `Interviews are a different game than building projects. You need to communicate your logic clearly. Time to grind Data Structures and Algorithms.`,
        tasks: [
          'Solve top 50 array/string DSA questions',
          'Practice debugging broken code',
          'Do at least 3 mock interviews (Pramp, Interviewing.io)'
        ],
        resources: {
          youtube_video: { title: 'Technical Interview Tips', url: 'https://youtube.com/results?search_query=Mock+Technical+Interview' },
          practice_links: [
            { name: 'LeetCode', url: 'https://leetcode.com' },
            { name: 'HackerRank', url: 'https://hackerrank.com' }
          ]
        }
      },
      {
        phase_number: 5,
        phase_title: 'Job Readiness',
        mentor_advice: `This is the final checklist. Do not apply until these are perfect. A bad first impression burns the bridge with the recruiter.`,
        tasks: [
          '2 strong, unique projects with live links',
          'GitHub visually active (green commits)',
          'Resume updated to one page, highlighting tech stack',
          'LinkedIn optimized for recruiter searches'
        ],
        resources: {
          youtube_video: { title: 'How to write a developer resume', url: 'https://youtube.com/results?search_query=developer+resume+tips' },
          practice_links: [
            { name: 'LinkedIn', url: 'https://linkedin.com' }
          ]
        }
      }
    ];

    const reality_check = devGapScore < 70 
      ? "You are not job-ready yet. Provide real effort, and follow this roadmap strictly. No shortcuts."
      : "You have a solid foundation, but you need polishing. Execute this roadmap to secure the job.";

    const mentor_intro = `Listen carefully. You want to be a ${targetRole}. I'm going to guide you there, step by step, focusing on real-world practical skills. I don't care about the tutorials you watched. I care about what you can build.`;

    res.json({
      roadmap_title: "Mentor-Driven Execution Plan",
      target_role: targetRole,
      devGapScore,
      reality_check,
      show_reality_warning: devGapScore < 70,
      mentor_intro,
      phases
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Mentor Roadmap generation failed' });
  }
});

export default router;

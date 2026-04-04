import express from 'express';
import GitHubData from '../models/GitHubData.js';
import protect from '../middleware/auth.js';

const router = express.Router();

const fetchGitHub = async (url, token) => {
  const headers = { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'DevGap-AI' };
  if (token && token !== 'YOUR_GITHUB_TOKEN_HERE') {
    headers.Authorization = `token ${token}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
};

router.post('/analyze', protect, async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'GitHub username required' });

  const token = process.env.GITHUB_TOKEN;
  const user = await fetchGitHub(`https://api.github.com/users/${username}`, token);
  const repos = await fetchGitHub(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, token);

  const languages = {};
  let totalStars = 0;
  let activeReposCount = 0;
  const topRepos = [];

  const frontendTech = new Set();
  const backendTech = new Set();
  const toolTech = new Set();

  const FRONTEND_MAP = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'Svelte'];
  const BACKEND_MAP = ['Python', 'Java', 'C#', 'Go', 'Ruby', 'PHP', 'C++', 'C', 'Rust'];
  const TOOLS_MAP = ['Shell', 'Makefile', 'Dockerfile', 'Jupyter Notebook', 'PowerShell'];

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  for (const repo of repos) {
    totalStars += repo.stargazers_count || 0;
    
    // Check if repo is active
    if (new Date(repo.updated_at) > sixMonthsAgo) {
      activeReposCount++;
    }

    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
      
      if (FRONTEND_MAP.includes(repo.language)) frontendTech.add(repo.language);
      else if (BACKEND_MAP.includes(repo.language)) backendTech.add(repo.language);
      else if (TOOLS_MAP.includes(repo.language)) toolTech.add(repo.language);
    }

    topRepos.push({
      name: repo.name,
      description: repo.description || '',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || 'Unknown',
      url: repo.html_url,
    });
  }

  topRepos.sort((a, b) => b.stars - a.stars);
  const bestRepos = topRepos.slice(0, 5);

  const langCount = Object.keys(languages).length;
  const publicRepos = user.public_repos || 0;
  
  // Advanced Scoring logic
  const activityScore = Math.min(100, Math.round((activeReposCount / Math.max(publicRepos, 1)) * 100 + (totalStars * 2)));
  const portfolioScore = Math.min(100, Math.round((publicRepos > 15 ? 30 : publicRepos * 2) + Math.min(langCount * 5, 25) + Math.min(totalStars * 3, 45)));

  // Insight Generation System
  const insights = [];
  const weaknesses = [];
  const recommendations = [];

  if (frontendTech.size > backendTech.size && backendTech.size === 0) {
    insights.push("You are highly focused on Frontend technologies.");
    weaknesses.push("Missing core backend architecture knowledge.");
    recommendations.push("Learn Node.js or Python to become full-stack.");
  } else if (backendTech.size > frontendTech.size && frontendTech.size === 0) {
    insights.push("You show a strong preference for Backend/System engineering.");
    weaknesses.push("Lack of visible frontend UI/UX skills.");
    recommendations.push("Build a React frontend to consume your APIs.");
  } else if (frontendTech.size > 0 && backendTech.size > 0) {
    insights.push("You demonstrate versatile Full-Stack capability.");
  }

  if (publicRepos < 5) {
    weaknesses.push("Low project depth. You need more public repositories.");
    recommendations.push("Start building complex, multi-page applications, not just tutorials.");
  }

  if (activeReposCount < 2) {
    weaknesses.push("Your recent contribution consistency is very low.");
  } else {
    insights.push(`You are actively maintaining ${activeReposCount} repositories.`);
  }

  if (totalStars === 0) {
    weaknesses.push("No community engagement (Stars/Forks). Your projects lack real-world utility.");
  } else {
    insights.push("Your projects show evidence of community utility and impact.");
  }

  // Verdict Generation
  let verdict = "Beginner Developer. Your GitHub does not reflect job-ready skills yet. Focus on building and deploying 3 complex projects.";
  if (portfolioScore > 80) verdict = "Senior-Level Portfolio. Excellent depth, community impact, and consistency. Highly hirable.";
  else if (portfolioScore > 50) verdict = "Mid-Level Developer. Good foundation, but needs more complex architecture or active contributions.";
  else if (portfolioScore > 30) verdict = "Junior Developer. Shows promise, but project complexity is likely low. Keep building.";

  const data = await GitHubData.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id, username, avatarUrl: user.avatar_url, bio: user.bio,
      publicRepos: user.public_repos, followers: user.followers, following: user.following,
      totalStars, languages, topRepos: bestRepos, activityScore, portfolioScore, activeRepos: activeReposCount,
      skills: { frontend: Array.from(frontendTech), backend: Array.from(backendTech), tools: Array.from(toolTech) },
      insights, weaknesses, recommendations, verdict, analyzedAt: new Date(),
    },
    { new: true, upsert: true }
  );
  res.json(data);
});

router.get('/', protect, async (req, res) => {
  const data = await GitHubData.findOne({ user: req.user._id });
  res.json(data || null);
});

export default router;

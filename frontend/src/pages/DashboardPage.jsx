import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import {
  RiSparklingLine, RiGithubLine, RiFileTextLine, RiBrainLine,
  RiRoadMapLine, RiLineChartLine, RiArrowRightLine,
  RiShieldCheckLine, RiLightbulbLine, RiTimeLine, RiPsychotherapyLine,
  RiCheckboxCircleLine, RiFlashlightLine, RiTrophyLine
} from 'react-icons/ri';
import ScoreRing from '../components/ScoreRing.jsx';



// ── DAILY CHALLENGES (rotates by day of week) ────────────────────────────────
const DAILY_CHALLENGES = [
  { day: 0, emoji: '🌅', title: 'Sunday Reset', tasks: ['Plan your week — write 3 learning goals', 'Review your GitHub and close old branches', 'Read one technical article or blog post'] },
  { day: 1, emoji: '💡', title: 'Monday Momentum', tasks: ['Build one new small feature today', 'Push at least 2 commits to GitHub', 'Watch one tutorial on your weakest skill'] },
  { day: 2, emoji: '⚡', title: 'Tuesday Deep Work', tasks: ['Spend 2+ hrs on your hardest project', 'Solve one LeetCode or HackerRank problem', 'Document something you built this week'] },
  { day: 3, emoji: '🎯', title: 'Wednesday Focus', tasks: ['No new courses — only build today', 'Review your roadmap and update progress', 'Write a README for one of your projects'] },
  { day: 4, emoji: '🔥', title: 'Thursday Streak', tasks: ['Commit to GitHub before 10 PM', 'Add tests or improve one existing project', 'Share your progress publicly (tweet/post)'] },
  { day: 5, emoji: '🚀', title: 'Friday Apply Day', tasks: ['Apply to 2-3 job openings', 'Update your resume with latest work', 'Research 1 target company thoroughly'] },
  { day: 6, emoji: '🧠', title: 'Saturday Skill Day', tasks: ['Deep-dive one concept you\'ve been avoiding', 'Build something from scratch, no tutorial', 'Review and refactor old code you wrote'] },
];

const QUOTES = [
  { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
  { text: "Every great developer you know got there by solving problems they were unqualified to solve.", author: "Patrick McKenzie" },
  { text: "It's not a bug, it's an undocumented feature. Fix it anyway.", author: "DevGap AI" },
];

function TodaysFocus() {
  const today = new Date();
  const dayIndex = today.getDay();
  const todayStr = today.toDateString();
  const challenge = DAILY_CHALLENGES[dayIndex];
  const quote = QUOTES[dayIndex % QUOTES.length];

  const [checked, setChecked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('daily_focus') || '{}');
      return saved.date === todayStr ? saved.checked : {};
    } catch { return {}; }
  });

  const toggle = (i) => {
    const next = { ...checked, [i]: !checked[i] };
    setChecked(next);
    try { localStorage.setItem('daily_focus', JSON.stringify({ date: todayStr, checked: next })); } catch {}
  };

  const doneCount = Object.values(checked).filter(Boolean).length;
  const allDone = doneCount === challenge.tasks.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Daily Challenge */}
      <div className="md:col-span-2 neon-glass-card p-5 border border-primary-500/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{challenge.emoji}</span>
            <div>
              <p className="text-xs text-primary-400 font-bold uppercase tracking-wider">Today's Challenge</p>
              <h3 className="text-white font-bold text-base">{challenge.title}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary-400">{doneCount}/{challenge.tasks.length}</p>
            <p className="text-xs text-slate-400">completed</p>
          </div>
        </div>
        <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden mb-4">
          <div
            style={{ width: `${(doneCount / challenge.tasks.length) * 100}%`, transition: 'width 0.6s ease-out' }}
            className="h-full bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full"
          />
        </div>
        <div className="space-y-2">
          {challenge.tasks.map((task, i) => (
            <button key={i} onClick={() => toggle(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                checked[i] ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-700/40 border-white/5 hover:border-primary-500/20'
              }`}>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                checked[i] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
              }`}>
                {checked[i] && <RiCheckboxCircleLine className="text-white text-xs" />}
              </div>
              <span className={`text-sm ${checked[i] ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task}</span>
            </button>
          ))}
        </div>
        {allDone && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 animate-fade-in">
            <RiTrophyLine className="text-yellow-400 text-xl flex-shrink-0" />
            <p className="text-emerald-400 font-bold text-sm">All done! You're ahead of 90% of people. Keep shipping. 🔥</p>
          </div>
        )}
      </div>

      {/* Quote of the Day */}
      <div className="neon-glass-card p-5 bg-gradient-to-br from-purple-900/20 to-obsidian-800 border border-purple-500/10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <RiFlashlightLine className="text-purple-400 text-base" />
            <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">Dev Quote</p>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed italic mb-4">
            "{quote.text}"
          </p>
          <p className="text-slate-400 text-xs">— {quote.author}</p>
        </div>
        <Link to="/mentor-mode"
          className="mt-4 w-full py-2.5 text-sm font-bold text-center bg-purple-600/20 text-purple-300 border border-purple-500/20 rounded-xl hover:bg-purple-600/30 hover:border-purple-500/30 transition-all">
          Talk to Mentor →
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [github, setGithub] = useState(null);
  const [resume, setResume] = useState(null);
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/profile').catch(() => ({ data: null })),
      axios.get('/api/github').catch(() => ({ data: null })),
      axios.get('/api/resume').catch(() => ({ data: null })),
      axios.get('/api/career/decision').catch(() => ({ data: null })),
    ]).then(([p, g, r, d]) => {
      setProfile(p.data);
      setGithub(g.data);
      setResume(r.data);
      setDecision(d.data);
    }).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const devGapScore = profile?.devGapScore || 0;
  const completionSteps = [
    { done: !!resume, label: 'Resume Uploaded', icon: RiFileTextLine, path: '/resume' },
    { done: !!github, label: 'GitHub Analyzed', icon: RiGithubLine, path: '/github' },
    { done: !!decision, label: 'Career Decided', icon: RiBrainLine, path: '/career-intent' },
  ];
  const completionPct = Math.round((completionSteps.filter(s => s.done).length / completionSteps.length) * 100);

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">
            {greeting}, <span className="glow-text text-white/90">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here's your career intelligence overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 live-pulse" />
          <span className="text-xs text-slate-500">Live</span>
        </div>
      </div>

      {/* ── TODAY'S FOCUS ── */}
      <TodaysFocus />

      {/* ── MENTOR MODE HIGHLIGHT BANNER ── */}
      <Link
        to="/mentor-mode"
        className="block p-5 rounded-2xl bg-gradient-to-r from-purple-900/60 to-blue-900/50 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/15 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <RiPsychotherapyLine className="text-white text-2xl" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white font-black text-lg">Mentor Mode — Human Decision Engine</p>
              <span className="text-xs font-bold px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md">NEW</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              A strict career mentor who challenges your decisions, detects contradictions, and gives you a brutally honest <strong className="text-purple-300">Human Readiness Score</strong>. Not AI advice — human-like thinking.
            </p>
          </div>
          <RiArrowRightLine className="text-purple-400 text-xl flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      {/* ROW 1: Profile / Score / Decision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile Card */}
        <div className="neon-glass-card-hover p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center text-slate-900 text-2xl font-black shadow-lg shadow-primary-500/30">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{user?.name}</h3>
              <p className="text-slate-500 text-sm">{profile?.targetRole || 'Set your target role'}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            {completionSteps.map(({ done, label, icon: Icon, path }) => (
              <Link key={label} to={path} className="flex items-center gap-2 text-sm group">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900/40/5 text-slate-400'}`}>
                  <Icon size={11} />
                </div>
                <span className={`flex-1 ${done ? 'text-emerald-400' : 'text-slate-400'}`}>{label}</span>
                {!done && <RiArrowRightLine size={12} className="text-slate-600 group-hover:text-primary-400 transition-colors" />}
              </Link>
            ))}
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Profile Completion</span>
              <span className="text-primary-400 font-bold">{completionPct}%</span>
            </div>
            <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
              <div style={{ width: `${completionPct}%` }} className="h-full bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full transition-all duration-1000" />
            </div>
          </div>
        </div>

        {/* DevGap Score */}
        <div className="neon-glass-card-hover p-6 flex flex-col items-center justify-center gap-4 text-center glow-primary">
          <p className="label-primary">DevGap Score</p>
          <ScoreRing score={devGapScore} size={120} />
          <div>
            <p className="text-white font-bold">
              {devGapScore >= 80 ? '🚀 Excellent' : devGapScore >= 60 ? '⚡ Good Progress' : devGapScore >= 40 ? '📈 Developing' : '🌱 Getting Started'}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              {decision ? `Targeting: ${decision.bestPath}` : 'Run Career Analysis to get your score'}
            </p>
          </div>
          {!decision && (
            <Link to="/career-intent" className="btn-primary text-sm px-4 py-2">Start Analysis</Link>
          )}
        </div>

        {/* Life Decision */}
        <div className="neon-glass-card-hover p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <RiLightbulbLine className="text-primary-400 text-xl" />
            <h3 className="section-title text-base">Life Decision</h3>
          </div>
          {decision ? (
            <>
              <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <p className="text-xs text-primary-400 font-semibold mb-1">BEST CAREER PATH</p>
                <p className="text-white font-bold text-lg">{decision.bestPath}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`${decision.failureRisk === 'low' ? 'badge-risk-low' : decision.failureRisk === 'medium' ? 'badge-risk-medium' : 'badge-risk-high'}`}>
                  <RiShieldCheckLine size={10} />
                  {decision.failureRisk?.toUpperCase()} RISK
                </div>
                <span className="text-slate-500 text-xs">{decision.timeRequired}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <RiTimeLine className="text-primary-400" />
                <span>Job Eligible: <span className={decision.jobEligible ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{decision.jobEligible ? 'YES ✓' : 'NOT YET'}</span></span>
              </div>
              <Link to="/career-decision" className="text-primary-400 text-sm font-medium hover:text-primary-300 flex items-center gap-1 mt-auto">
                View Full Report <RiArrowRightLine />
              </Link>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-4">
              <RiBrainLine className="text-4xl text-slate-600" />
              <p className="text-slate-500 text-sm">Complete Intent Engine + GitHub Analysis to unlock your career decision</p>
              <Link to="/career-intent" className="btn-primary text-sm px-4 py-2">Start Now</Link>
            </div>
          )}
        </div>
      </div>

      {/* ROW 2: Skills / Portfolio / Risk */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Skills */}
        <div className="neon-glass-card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Detected Skills</h3>
            <Link to="/resume" className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1">Upload Resume <RiArrowRightLine /></Link>
          </div>
          {resume?.extractedSkills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resume.extractedSkills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-slate-700 border border-white/5 rounded-lg text-xs text-slate-300 capitalize">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <RiFileTextLine className="text-4xl text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Upload your resume to extract skills</p>
              <Link to="/resume" className="text-primary-400 text-xs mt-2 inline-block hover:text-primary-300">Upload PDF →</Link>
            </div>
          )}
        </div>

        {/* Portfolio Score */}
        <div className="neon-glass-card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Portfolio Score</h3>
            <Link to="/github" className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1">Analyze <RiArrowRightLine /></Link>
          </div>
          {github ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={github.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full border-2 border-primary-500/30" />
                <div>
                  <p className="text-white font-bold">@{github.username}</p>
                  <p className="text-slate-500 text-xs">{github.publicRepos} repos · {github.followers} followers</p>
                </div>
              </div>
              {[
                { label: 'Portfolio Score', value: github.portfolioScore, color: 'from-primary-600 to-secondary-500' },
                { label: 'Activity Score', value: github.activityScore, color: 'from-blue-500 to-cyan-500' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-white font-bold">{value}/100</span>
                  </div>
                  <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div style={{ width: `${value}%` }} className={`h-full bg-gradient-to-r ${color} rounded-full`} />
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: '⭐ Stars', value: github.totalStars },
                  { label: '📦 Repos', value: github.publicRepos },
                  { label: '👥 Followers', value: github.followers },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-700 rounded-xl p-2">
                    <p className="text-white font-bold text-sm">{value}</p>
                    <p className="text-slate-400 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <RiGithubLine className="text-4xl text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Analyze your GitHub profile</p>
              <Link to="/github" className="text-primary-400 text-xs mt-2 inline-block hover:text-primary-300">Connect GitHub →</Link>
            </div>
          )}
        </div>

        {/* Risk Meter */}
        <div className="neon-glass-card-hover p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Risk Analysis</h3>
            <Link to="/career-decision" className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1">Details <RiArrowRightLine /></Link>
          </div>
          {decision ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl text-center neon-glass-card border ${decision.failureRisk === 'low' ? 'bg-emerald-500/10' : decision.failureRisk === 'medium' ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
                <p className="text-4xl mb-2">{decision.failureRisk === 'low' ? '🟢' : decision.failureRisk === 'medium' ? '🟡' : '🔴'}</p>
                <p className={`font-black text-2xl ${decision.failureRisk === 'low' ? 'text-emerald-400' : decision.failureRisk === 'medium' ? 'text-amber-400' : 'text-red-400'}`}>
                  {decision.failureRisk?.toUpperCase()} RISK
                </p>
                <p className="text-slate-500 text-xs mt-1">{decision.confidencePercent}% confidence score</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Failure Factors</p>
                {decision.failureReasons?.slice(0, 2).map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                    <span className="text-red-400 mt-0.5">⚠</span>
                    <span>{r}</span>
                  </div>
                ))}
                {!decision.failureReasons?.length && (
                  <p className="text-emerald-400 text-xs">No major risk factors detected!</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Success Factors</p>
                {decision.successFactors?.slice(0, 2).map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <RiShieldCheckLine className="text-4xl text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Run career analysis to see your risk level</p>
            </div>
          )}
        </div>
      </div>


      {/* ROW 3: Roadmap Preview / Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Roadmap preview */}
        <div className="neon-glass-card-hover p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Roadmap Progress</h3>
            <Link to="/roadmap" className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1">Full Roadmap <RiArrowRightLine /></Link>
          </div>
          <div className="text-center py-8 border border-white/5 rounded-xl border-dashed">
            <RiRoadMapLine className="text-5xl text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm mb-3">Generate your personalized learning roadmap</p>
            <Link to="/roadmap" className="btn-primary text-sm px-5 py-2.5">Generate Roadmap</Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="neon-glass-card-hover p-6">
          <h3 className="section-title mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: RiBrainLine, label: 'Intent Engine', sub: 'Tell us your goals', path: '/career-intent', color: 'text-purple-400' },
              { icon: RiGithubLine, label: 'GitHub Analyzer', sub: 'Analyze your repos', path: '/github', color: 'text-blue-400' },
              { icon: RiFileTextLine, label: 'Upload Resume', sub: 'Extract your skills', path: '/resume', color: 'text-green-400' },
              { icon: RiLineChartLine, label: 'Job Trends', sub: 'See what\'s hot', path: '/trends', color: 'text-red-400' },
            ].map(({ icon: Icon, label, sub, path, color }) => (
              <Link key={path} to={path}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/5 transition-colors group">
                <Icon className={`text-xl flex-shrink-0 ${color}`} />
                <div>
                  <p className="text-sm text-white font-medium group-hover:text-primary-400 transition-colors">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
                <RiArrowRightLine className="ml-auto text-slate-600 group-hover:text-primary-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

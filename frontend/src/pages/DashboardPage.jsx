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
  { day: 0, emoji: '🌅', title: 'Sunday Reset', tasks: ['Plan your week — write 3 goals', 'Review your GitHub', 'Read one tech blog'] },
  { day: 1, emoji: '💡', title: 'Monday Momentum', tasks: ['Build ONE small feature', 'Push 2 commits', 'Watch one tutorial'] },
  { day: 2, emoji: '⚡', title: 'Tuesday Deep Work', tasks: ['2+ hrs on hardest project', 'Solve one LeetCode', 'Document your progress'] },
  { day: 3, emoji: '🎯', title: 'Wednesday Focus', tasks: ['No new courses — BUILD', 'Update your roadmap', 'Write a README'] },
  { day: 4, emoji: '🔥', title: 'Thursday Streak', tasks: ['Commit before 10 PM', 'Improve existing project', 'Share progress publicly'] },
  { day: 5, emoji: '🚀', title: 'Friday Apply Day', tasks: ['Apply to 3 job openings', 'Update your resume', 'Research 1 target company'] },
  { day: 6, emoji: '🧠', title: 'Saturday Skill Day', tasks: ['Deep-dive one logic concept', 'Build scratch projects', 'Refactor old code'] },
];

const QUOTES = [
  { text: "The only way to learn a new language is by writing programs in it.", author: "Dennis Ritchie" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Daily Challenge */}
      <div className="lg:col-span-2 neon-glass-card p-4 md:p-6 border border-primary-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl shadow-inner border border-white/5">
              {challenge.emoji}
            </div>
            <div>
              <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest mb-1 opacity-70">Focus Activity</p>
              <h3 className="text-white font-black text-lg md:text-xl tracking-tight">{challenge.title}</h3>
            </div>
          </div>
          <div className="flex h-fit bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5 items-center gap-3 self-end sm:self-center">
            <span className="text-2xl font-black text-primary-400">{doneCount}/{challenge.tasks.length}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Tasks Done</span>
          </div>
        </div>
        <div className="space-y-3">
          {challenge.tasks.map((task, i) => (
            <button key={i} onClick={() => toggle(i)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 transform active:scale-[0.98] ${
                checked[i] ? 'bg-emerald-500/5 border-emerald-500/20 shadow-inner' : 'bg-slate-800/40 border-white/5 hover:border-primary-500/20'
              }`}>
              <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                checked[i] ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-700'
              }`}>
                {checked[i] && <RiCheckboxCircleLine className="text-white text-sm" />}
              </div>
              <span className={`text-sm md:text-base font-medium ${checked[i] ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quote Module */}
      <div className="neon-glass-card p-6 bg-gradient-to-br from-purple-900/20 to-obsidian-800 border border-purple-500/10 flex flex-col justify-between group overflow-hidden relative">
        <RiFlashlightLine className="absolute -top-4 -right-4 text-purple-500/5 text-9xl rotate-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Growth Dose</p>
          </div>
          <p className="text-slate-100 text-base md:text-lg leading-relaxed font-medium italic mb-6">
            "{quote.text}"
          </p>
          <p className="text-slate-500 text-xs font-bold tracking-tight">— {quote.author}</p>
        </div>
        <Link to="/mentor-mode"
          className="relative z-10 mt-8 w-full py-4 text-xs font-black uppercase tracking-widest text-center bg-purple-600/20 text-purple-300 border border-purple-500/20 rounded-2xl hover:bg-purple-600/30 hover:border-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-950/20">
          Sync with Mentor →
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
      setProfile(p.data); setGithub(g.data); setResume(r.data); setDecision(d.data);
    }).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const devGapScore = profile?.devGapScore || 0;
  
  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[80vh]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Dashboard</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-8 animate-fade-in max-w-[1600px] mx-auto">
      {/* Header Layout */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
            Good evening, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">{user?.name?.split(' ')[0]}</span>.
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-black uppercase tracking-widest opacity-80">welcome to career intelligence portal</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-white/5">
           <div className="w-3 h-3 rounded-full bg-emerald-400 live-pulse shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
           <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Real-Time Core Engine: Active</span>
        </div>
      </div>

      <TodaysFocus />

      {/* ── MENTOR MODE BANNER - RESPONSIVE STACK ── */}
      <Link to="/mentor-mode" className="block p-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-transparent border border-white/5 hover:border-purple-500/40 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000" />
        <div className="relative p-6 md:p-8 rounded-[1.4rem] bg-slate-950/40 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8">
           <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-500/40 relative">
              <RiPsychotherapyLine className="text-white text-4xl" />
              <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-white/10 p-2 rounded-xl shadow-lg animate-bounce">
                <RiSparklingLine className="text-purple-400 text-sm" />
              </div>
           </div>
           <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Human Decision Engine <span className="text-purple-500 text-lg">01</span></h3>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
                Connect with Aman for a <span className="text-purple-300 font-bold underline decoration-purple-500/30">Brutally Honest</span> career reality check. We don't just give roadmaps—we simulate your market value and failure risks.
              </p>
           </div>
           <div className="w-full md:w-fit bg-white text-slate-950 font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-3 group-hover:bg-purple-400 transition-colors">
              Engage Protocol <RiArrowRightLine className="group-hover:translate-x-2 transition-transform" />
           </div>
        </div>
      </Link>

      {/* Responsive Core Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="neon-glass-card-hover p-6 flex flex-col gap-6">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-primary-500/40 ring-4 ring-white/5">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-white text-xl truncate">{user?.name}</h3>
                <p className="text-primary-400 text-xs font-bold uppercase tracking-widest truncate">{profile?.targetRole || 'Intelligence Analyst'}</p>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-3">
              {[
                { done: !!resume, label: 'Resume', path: '/resume' },
                { done: !!github, label: 'GitHub', path: '/github' },
                { done: !!decision, label: 'Intent', path: '/career-intent' }
              ].map(s => (
                <Link key={s.label} to={s.path} className={`p-3 rounded-xl border text-[10px] font-black uppercase text-center tracking-widest transition-all ${s.done ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800/50 border-white/5 text-slate-500 hover:text-white hover:border-white/20'}`}>
                   {s.label}
                </Link>
              ))}
           </div>
        </div>

        {/* Score Ring Module */}
        <div className="neon-glass-card-hover p-8 flex flex-col items-center justify-center gap-6 text-center group">
          <div className="relative">
             <div className="absolute inset-0 bg-primary-500/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <ScoreRing score={devGapScore} size={140} />
          </div>
          <div>
            <p className="text-white font-black text-xl mb-1 uppercase tracking-tighter">DevGap Rating</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Unified Career Readiness Score</p>
          </div>
        </div>

        {/* Decision & Risk Module */}
        <div className="neon-glass-card-hover p-6 flex flex-col gap-6">
           <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">Current Trajectory</p>
              <RiShieldCheckLine className="text-primary-400 text-xl" />
           </div>
           {decision ? (
             <div className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="bg-primary-500/5 border border-primary-500/20 p-5 rounded-[2rem] text-center">
                   <p className="text-[10px] text-primary-400 font-bold uppercase mb-2 tracking-widest">Target Path</p>
                   <p className="text-white font-black text-2xl tracking-tighter uppercase">{decision.bestPath}</p>
                </div>
                <div className="flex items-center justify-between px-2">
                   <div className="flex flex-col gap-1">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">Risk Profile</p>
                      <span className={`text-xs font-black uppercase tracking-tighter ${decision.failureRisk === 'low' ? 'text-emerald-400' : 'text-red-400'}`}>{decision.failureRisk} Risk</span>
                   </div>
                   <div className="w-px h-6 bg-white/10" />
                   <div className="flex flex-col gap-1 text-right">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">Eligibility</p>
                      <span className={`text-xs font-black uppercase tracking-tighter ${decision.jobEligible ? 'text-emerald-400' : 'text-slate-500'}`}>{decision.jobEligible ? 'Verified' : 'Pending'}</span>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-6 opacity-40">
                <RiBrainLine size={40} className="text-slate-700" />
                <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] leading-relaxed">Intelligence Incomplete.<br/>Sync Intent Engine to proceed.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  RiLineChartLine, RiArrowUpLine, RiArrowDownLine,
  RiCheckboxCircleLine, RiTimeLine, RiBrainLine, RiFileTextLine, RiArrowRightLine
} from 'react-icons/ri';

function MockTestGeneratorCard({ missingSkills }) {
  const navigate = useNavigate();
  const skillsToTest = missingSkills?.length > 0 ? missingSkills : ['TypeScript', 'Docker', 'System Design', 'React'];
  const testTime = skillsToTest.length * 5;

  return (
    <div className="neon-glass-card-hover p-6 md:p-8 bg-gradient-to-br from-slate-800 to-slate-900 border-transparent hover:border-purple-500/50 relative overflow-hidden group mb-5">
      {/* Animated gradient glow border base */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-secondary-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
        {/* Left Side: Info */}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            🎙️ Interview Readiness Simulator
          </h2>
          <p className="text-slate-500 text-sm md:text-base mb-6">
            Practice real technical & HR questions with an AI mock interviewer.
          </p>

          <div className="mb-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Missing Skills</h3>
            {missingSkills?.length === 0 ? (
              <p className="text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg inline-block text-sm">
                No missing skills detected!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skillsToTest.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-900/40/5 border border-white/10 rounded-xl text-sm font-medium text-slate-300 shadow-sm group-hover:border-purple-500/30 group-hover:text-purple-300 transition-all cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950/50 rounded-lg border border-white/5">
              <RiTimeLine className="text-primary-400 text-lg" />
              <span>Voice & Text Simulation</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950/50 rounded-lg border border-white/5">
              <RiBrainLine className="text-purple-400 text-lg" />
              <span>Concept & Clarity Evaluation</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950/50 rounded-lg border border-white/5">
              <RiFileTextLine className="text-emerald-400 text-lg" />
              <span>HR + Technical Questions</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action CTA */}
        <div className="w-full lg:w-72 mt-2 lg:mt-0">
          <button 
            disabled={missingSkills?.length === 0}
            onClick={() => navigate('/mock-test')} 
            className={`w-full py-4 rounded-xl font-black text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 flex items-center justify-center gap-2 ${
              missingSkills?.length === 0 
                ? 'bg-slate-900/40 text-slate-400 shadow-none cursor-not-allowed opacity-70' 
                : 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-[1.03] active:scale-95'
            }`}>
            {missingSkills?.length === 0 ? 'No Practice Required' : 'Enter Interview Engine'} 
            {missingSkills?.length !== 0 && <RiArrowRightLine className="text-lg" />}
          </button>
          
          {/* Progress visual flair */}
          <div className="mt-6 p-4 bg-slate-950/50 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <RiBrainLine />
              </div>
              <div>
                <p className="text-white text-xs font-bold font-mono tracking-wider mb-0.5">LAUNCHING SIMULATOR</p>
                <div className="h-1 bg-slate-900/40 rounded-full w-full">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full w-[85%] live-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrendsPage() {
  const [trends, setTrends] = useState(null);
  const [missingSkills, setMissingSkills] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/career/trends').catch(() => ({ data: null })),
      axios.get('/api/resume').catch(() => ({ data: null }))
    ]).then(([t, r]) => {
      setTrends(t.data);
      setMissingSkills(r.data?.missingSkills || ["React", "System Design", "AWS", "Docker"]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const diffColor = { Easy: 'text-emerald-400 bg-emerald-500/10', Medium: 'text-amber-400 bg-amber-500/10', Hard: 'text-red-400 bg-red-500/10', 'Very Hard': 'text-purple-400 bg-purple-500/10' };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <RiLineChartLine className="text-xl text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Future Job Trends</h1>
          <p className="text-slate-500 text-sm">Trending skills, emerging roles & dying careers</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 live-pulse" />
          <span className="text-xs text-slate-500">Live 2024 Data</span>
        </div>
      </div>

      {/* Trending Skills */}
      <div className="neon-glass-card p-6 mb-5">
        <h3 className="section-title mb-5">🚀 Trending Skills & Salaries</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trends?.trendingSkills?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-900/40/5 border border-white/5 rounded-xl hover:border-primary-500/20 transition-all duration-200 group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-sm group-hover:text-primary-400 transition-colors">{item.skill}</p>
                  <span className="text-emerald-400 text-xs font-bold">{item.growth}</span>
                </div>
                <p className="text-slate-500 text-xs">{item.salary}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${diffColor[item.difficulty] || 'text-slate-500 bg-slate-900/600/10'}`}>
                  {item.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Emerging Roles */}
        <div className="neon-glass-card p-6">
          <h3 className="section-title mb-4">🌱 Top Emerging Roles</h3>
          <div className="space-y-3">
            {trends?.topEmergingRoles?.map((role, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-900/40/5 rounded-xl">
                <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-white text-sm font-medium">{role}</p>
                <RiArrowUpLine className="ml-auto text-emerald-400 text-lg flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Dying Roles */}
        <div className="neon-glass-card p-6">
          <h3 className="section-title mb-1">⚠️ Declining Roles</h3>
          <p className="text-slate-500 text-xs mb-4">Roles being automated or losing demand</p>
          <div className="space-y-3">
            {trends?.dyingRoles?.map((role, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                <div className="w-7 h-7 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-xs font-black flex-shrink-0">
                  ✗
                </div>
                <p className="text-slate-300 text-sm font-medium line-through decoration-red-500/50">{role}</p>
                <RiArrowDownLine className="ml-auto text-red-400 text-lg flex-shrink-0" />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
            <p className="text-amber-400 text-xs font-semibold mb-1">⚡ AI Impact Warning</p>
            <p className="text-slate-500 text-xs">Automation is replacing repetitive, low-skill roles. Focus on high-value, creative, and system-level skills.</p>
          </div>
        </div>
      </div>

      {/* ── MULTI-LANGUAGE SMART MOCK TEST CARD ── */}
      <MockTestGeneratorCard missingSkills={missingSkills} />

      {/* Summary Banner */}
      <div className="neon-glass-card p-5 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20">
        <div className="flex items-center gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <p className="text-white font-bold">Market Insight 2024</p>
            <p className="text-slate-500 text-sm">
              AI/ML and Cloud Engineering are the #1 fastest growing fields with 300%+ demand surge.
              Full-Stack remains the most hirable entry-level path. Avoid over-specializing in dying technologies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

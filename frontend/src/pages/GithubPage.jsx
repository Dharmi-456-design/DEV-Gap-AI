import { useState, useEffect } from 'react';
import axios from 'axios';
import { RiGithubLine, RiSearchLine, RiStarLine, RiGitForkLine, RiCodeLine, RiCheckLine, RiGlobalLine, RiPsychotherapyLine, RiRoadMapLine } from 'react-icons/ri';

export default function GithubPage() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/github').then(r => { if (r.data) setData(r.data); }).catch(() => {});
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true); setError('');
    try {
      const { data: result } = await axios.post('/api/github/analyze', { username });
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || 'GitHub analysis failed. Check the username.');
    } finally { setLoading(false); }
  };

  const langColors = {
    JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219',
    'C++': '#f34b7d', Go: '#00ADD8', Rust: '#dea584', CSS: '#563d7c', HTML: '#e34c26', Ruby: '#701516',
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <RiGithubLine className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">GitHub Analyzer</h1>
            <p className="text-slate-500 text-sm">Analyze repos, languages & portfolio strength</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleAnalyze} className="neon-glass-card p-6 mb-6">
        <label className="label-primary">GitHub Username</label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <RiGithubLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="e.g. torvalds, gaearon, sindresorhus"
              className="input-dark pl-10"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-6">
            {loading ? <div className="w-5 h-5 border-2 border-slate-900/50 border-t-slate-900 rounded-full animate-spin" /> : <><RiSearchLine /> Analyze</>}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </form>

      {data && (
        <div className="space-y-5 animate-slide-up">
          {/* Profile Header */}
          <div className="neon-glass-card p-6 flex flex-col sm:flex-row items-center gap-6">
            <img src={data.avatarUrl} alt="avatar" className="w-20 h-20 rounded-2xl border-2 border-primary-500/30 shadow-xl" />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-black text-white">@{data.username}</h2>
              <p className="text-slate-500 text-sm mt-1">{data.bio || 'No bio set'}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
                {[
                  { label: 'Repos', value: data.publicRepos, icon: '📦' },
                  { label: 'Stars', value: data.totalStars, icon: '⭐' },
                  { label: 'Followers', value: data.followers, icon: '👥' },
                  { label: 'Following', value: data.following, icon: '➡️' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="text-center">
                    <p className="text-white font-black text-xl">{value}</p>
                    <p className="text-slate-500 text-xs">{icon} {label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              {[
                { label: 'Portfolio', value: data.portfolioScore, color: '#f59e0b' },
                { label: 'Activity', value: data.activityScore, color: '#3b82f6' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#1a1a26" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3"
                        strokeLinecap="round" strokeDasharray="94" strokeDashoffset={94 - (value / 100) * 94}
                        style={{ transition: 'stroke-dashoffset 1s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-black text-sm">{value}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NEW: Developer Analysis Verdict */}
          {data.verdict && (
            <div className="neon-glass-card p-6 bg-gradient-to-r from-slate-800 to-slate-900 border-l-4 border-l-primary-500">
              <h3 className="text-xl font-black text-white flex items-center gap-2 mb-2">
                <RiCheckLine className="text-primary-500" /> Real Developer Verdict
              </h3>
              <p className="text-slate-300 font-medium leading-relaxed">{data.verdict}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Languages */}
            <div className="neon-glass-card p-6">
              <h3 className="section-title mb-4">Top Languages</h3>
              <div className="space-y-3">
                {data.languages && Object.entries(data.languages).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([lang, count]) => {
                  const total = Object.values(data.languages).reduce((a, b) => a + b, 0);
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={lang}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: langColors[lang] || '#94a3b8' }} />
                          <span className="text-slate-300">{lang}</span>
                        </span>
                        <span className="text-slate-500">{pct}% ({count} repos)</span>
                      </div>
                      <div className="h-1.5 bg-slate-900/80 rounded-full overflow-hidden">
                        <div style={{ width: `${pct}%`, background: langColors[lang] || '#94a3b8' }} className="h-full rounded-full transition-all duration-1000" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extracted Skills */}
            {data.skills && (
              <div className="neon-glass-card p-6">
                <h3 className="section-title mb-4">Skill Extraction Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Frontend Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.frontend?.length > 0 ? data.skills.frontend.map(s => (
                        <span key={s} className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/20">{s}</span>
                      )) : <span className="text-slate-400 text-xs italic">No frontend tech detected.</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">Backend & Systems</p>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.backend?.length > 0 ? data.skills.backend.map(s => (
                        <span key={s} className="px-2 py-1 bg-pink-500/10 text-pink-300 text-xs rounded border border-pink-500/20">{s}</span>
                      )) : <span className="text-slate-400 text-xs italic">No backend tech detected.</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">DevOps & Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.tools?.length > 0 ? data.skills.tools.map(s => (
                        <span key={s} className="px-2 py-1 bg-primary-500/10 text-primary-300 text-xs rounded border border-primary-500/20">{s}</span>
                      )) : <span className="text-slate-400 text-xs italic">No standard DevOps tools detected.</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights & Weaknesses */}
            <div className="neon-glass-card p-6 md:col-span-2">
              <h3 className="section-title mb-5">Deep Intelligence Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Insights */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-blue-400 flex items-center gap-2"><RiGlobalLine/> POSITIVE INSIGHTS</p>
                  <ul className="space-y-2">
                    {data.insights?.map((msg, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>{msg}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-red-400 flex items-center gap-2"><RiPsychotherapyLine/> IDENTIFIED WEAKNESSES</p>
                  <ul className="space-y-2">
                    {data.weaknesses?.map((msg, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>{msg}
                      </li>
                    ))}
                    {data.weaknesses?.length === 0 && <li className="text-slate-400 text-sm italic">No major structural weaknesses detected.</li>}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-primary-400 flex items-center gap-2"><RiRoadMapLine/> STRATEGIC RECOMMENDATIONS</p>
                  <ul className="space-y-2">
                    {data.recommendations?.map((msg, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-primary-500 mt-1">•</span>{msg}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

            {/* Top Repos */}
            <div className="neon-glass-card p-6 md:col-span-2">
              <h3 className="section-title mb-4">Top Repositories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.topRepos?.slice(0, 6).map(repo => (
                  <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
                    className="block p-4 bg-slate-900/60 border border-white/5 rounded-xl hover:border-primary-500/30 transition-all duration-300 group hover:-translate-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-white text-sm font-semibold group-hover:text-primary-400 transition-colors truncate">{repo.name}</p>
                      <div className="flex items-center gap-2 flex-shrink-0 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><RiStarLine size={11} className="text-yellow-500"/>{repo.stars}</span>
                      </div>
                    </div>
                    {repo.description && <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">{repo.description}</p>}
                    {repo.language && (
                      <span className="inline-flex items-center gap-1.5 mt-3 text-xs text-slate-400">
                        <span className="w-2 h-2 rounded-full shadow-sm" style={{ background: langColors[repo.language] || '#94a3b8' }} />
                        {repo.language}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import {
  RiUserLine, RiSaveLine, RiCheckLine, RiGithubLine, RiLinkedinBoxLine,
  RiGlobalLine, RiMapPinLine, RiBriefcaseLine, RiBookOpenLine,
  RiSparklingLine, RiFireLine, RiTimeLine, RiPsychotherapyLine,
  RiFileTextLine, RiRoadMapLine, RiPencilLine, RiCloseLine, RiAddLine,
  RiDeleteBinLine, RiCalendarLine
} from 'react-icons/ri';

// ── CAREER JOURNAL ────────────────────────────────────────────────────────────
function CareerJournal() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('career_journal') || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [mood, setMood] = useState('motivated');

  const moods = [
    { key: 'motivated', emoji: '🔥', label: 'Motivated' },
    { key: 'focused', emoji: '🎯', label: 'Focused' },
    { key: 'tired', emoji: '😴', label: 'Tired' },
    { key: 'frustrated', emoji: '😤', label: 'Frustrated' },
    { key: 'proud', emoji: '💪', label: 'Proud' },
  ];

  const save = (newEntries) => {
    setEntries(newEntries);
    try { localStorage.setItem('career_journal', JSON.stringify(newEntries)); } catch {}
  };

  const addEntry = () => {
    if (!input.trim()) return;
    const entry = {
      id: Date.now(),
      text: input.trim(),
      mood,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    save([entry, ...entries]);
    setInput('');
  };

  const deleteEntry = (id) => save(entries.filter(e => e.id !== id));

  const moodColors = {
    motivated: 'text-secondary-400 bg-secondary-500/10 border-secondary-400/20',
    focused: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    tired: 'text-slate-500 bg-slate-900 border-slate-500/20',
    frustrated: 'text-red-400 bg-red-500/10 border-red-500/20',
    proud: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <div className="neon-glass-card p-4 md:p-8 border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <RiPencilLine size={120} />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <RiPencilLine className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Career Intelligence Journal</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Daily Log & Progress Sync</p>
        </div>
        <div className="sm:ml-auto bg-slate-900 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest self-start sm:self-center">
            {entries.length} Logs Saved
        </div>
      </div>

      <div className="mb-8 space-y-4 relative z-10">
        <div className="flex gap-2 flex-wrap pb-2 border-b border-white/5">
          {moods.map(m => (
            <button key={m.key} onClick={() => setMood(m.key)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all transform active:scale-95 ${mood === m.key ? moodColors[m.key] : 'border-white/5 text-slate-500 hover:border-white/20'}`}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={input} onChange={e => setInput(e.target.value)}
            placeholder="Document your wins, blockers, or mental shifts..."
            rows={3}
            className="flex-1 bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-all resize-none text-sm font-medium"
          />
          <button onClick={addEntry} disabled={!input.trim()}
            className="h-14 sm:h-auto sm:w-20 flex-shrink-0 bg-white text-slate-950 rounded-2xl flex items-center justify-center disabled:opacity-20 hover:bg-primary-400 transition-all active:scale-90">
            <RiAddLine size={28} />
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-3xl opacity-30">
          <RiCalendarLine className="text-5xl text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">No Neural Logs Found</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {entries.map(entry => (
            <div key={entry.id} className="p-6 bg-slate-950/40 border border-white/5 rounded-[2rem] group relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${moodColors[entry.mood]}`}>
                    {moods.find(m => m.key === entry.mood)?.emoji} {moods.find(m => m.key === entry.mood)?.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{entry.date} <span className="opacity-30">|</span> {entry.time}</span>
                </div>
                <button onClick={() => deleteEntry(entry.id)}
                  className="sm:opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 transition-all self-end sm:self-start">
                  <RiDeleteBinLine size={18} />
                </button>
              </div>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">{entry.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    bio: '', location: '', githubUsername: '', linkedinUrl: '',
    portfolioUrl: '', targetRole: '', experience: '0', education: '',
  });
  const [stats, setStats] = useState({ devGapScore: 0, resume: null, github: null, decision: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/api/profile').catch(() => ({ data: null })),
      api.get('/api/resume').catch(() => ({ data: null })),
      api.get('/api/github').catch(() => ({ data: null })),
      api.get('/api/career/decision').catch(() => ({ data: null })),
    ]).then(([p, r, g, d]) => {
      if (p.data) {
        const { bio, location, githubUsername, linkedinUrl, portfolioUrl, targetRole, experience, education } = p.data;
        setForm({ bio: bio||'', location: location||'', githubUsername: githubUsername||'', linkedinUrl: linkedinUrl||'', portfolioUrl: portfolioUrl||'', targetRole: targetRole||'', experience: experience||'0', education: education||'' });
        setStats(s => ({ ...s, devGapScore: p.data.devGapScore || 0 }));
      }
      setStats(s => ({ ...s, resume: r.data, github: g.data, decision: d.data }));
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/profile', form);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const fields = [
    { id: 'targetRole', label: 'Target Career Role', placeholder: 'e.g. AI Engineer', icon: RiBriefcaseLine },
    { id: 'location', label: 'Base Location', placeholder: 'e.g. Mumbai, India', icon: RiMapPinLine },
    { id: 'experience', label: 'Years Active', placeholder: '0', type: 'number', icon: RiTimeLine },
    { id: 'education', label: 'Education Credential', placeholder: 'e.g. Bachelor of Science', icon: RiBookOpenLine },
    { id: 'githubUsername', label: 'GitHub Identifier', placeholder: 'yourhandle', icon: RiGithubLine },
    { id: 'linkedinUrl', label: 'LinkedIn Access', placeholder: 'https://linkedin.com/in/...', icon: RiLinkedinBoxLine },
    { id: 'portfolioUrl', label: 'Portfolio Node', placeholder: 'https://yoursite.com', icon: RiGlobalLine },
  ];

  const completedModules = [!!stats.resume, !!stats.github, !!stats.decision].filter(Boolean).length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[80vh]">
       <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-10 max-w-7xl mx-auto animate-fade-in space-y-8 lg:space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 pb-8 border-b border-white/5">
        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-tr from-primary-600 down to-secondary-500 rounded-[2.5rem] flex items-center justify-center text-slate-900 text-4xl lg:text-6xl font-black shadow-2xl shadow-primary-500/40 border-4 border-white/10 ring-8 ring-primary-500/5">
           {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="space-y-2 flex-1">
           <div className="flex items-center gap-3">
              <h1 className="text-3xl lg:text-5xl font-black text-white italic tracking-tighter uppercase">{user?.name}</h1>
              <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                 <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Active Access</span>
              </div>
           </div>
           <p className="text-slate-500 font-bold text-sm lg:text-base tracking-tight">{user?.email} <span className="mx-2 opacity-20">|</span> <span className="text-primary-400 font-black uppercase tracking-widest text-xs italic">{form.targetRole || 'Awaiting Specialization'}</span></p>
        </div>
        <div className="hidden lg:flex flex-col items-end gap-1">
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">DevGap Score (Unified)</p>
           <span className="text-5xl font-black text-primary-400 tracking-tighter">{stats.devGapScore}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COMPACTS: 4/12 width */}
        <div className="lg:col-span-4 space-y-8">
           {/* Progress Module */}
           <div className="neon-glass-card p-8 border border-primary-500/10 relative group">
              <div className="flex justify-between items-end mb-6">
                 <div>
                    <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest mb-1">Career Maturity</p>
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Intelligence Core</h3>
                 </div>
                 <span className="text-3xl font-black text-primary-400">{Math.round((completedModules/3)*100)}<span className="text-xs opacity-40">%</span></span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden mb-8 border border-white/5 p-0.5">
                 <div style={{ width: `${(completedModules / 3) * 100}%` }} className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Resume Node', done: !!stats.resume, path: '/resume', icon: RiFileTextLine },
                  { label: 'GitHub Matrix', done: !!stats.github, path: '/github', icon: RiGithubLine },
                  { label: 'Career Decision', done: !!stats.decision, path: '/career-decision', icon: RiSparklingLine },
                ].map(({ label, done, path, icon: Icon }) => (
                  <Link key={label} to={path}
                    className={`flex items-center gap-4 p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${done ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/20 hover:text-white'}`}>
                    <Icon className="text-lg" />
                    {label}
                    {done && <RiCheckLine className="ml-auto text-lg" />}
                  </Link>
                ))}
              </div>
           </div>

           {/* Mobile-only Score Display */}
           <div className="lg:hidden neon-glass-card p-8 flex items-center justify-between border border-primary-500/10">
              <p className="text-xs font-black text-white uppercase tracking-widest">Unified Intelligence Rating</p>
              <span className="text-4xl font-black text-primary-400 tracking-tighter">{stats.devGapScore}</span>
           </div>

           {/* Quick Navigation Node */}
           <div className="neon-glass-card p-8 border border-white/5">
              <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-6">Cross-Module Access</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {[
                  { label: 'Aman Mentor', path: '/mentor-mode', icon: RiPsychotherapyLine, color: 'text-purple-400' },
                  { label: 'Elite Roadmap', path: '/roadmap', icon: RiRoadMapLine, color: 'text-blue-400' },
                  { label: 'Market Trends', path: '/trends', icon: RiFireLine, color: 'text-secondary-400' },
                ].map(({ label, path, icon: Icon, color }) => (
                  <Link key={path} to={path}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                    <Icon className={`${color} text-2xl group-hover:scale-110 transition-transform`} />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-tight">{label}</span>
                  </Link>
                ))}
              </div>
           </div>
        </div>

        {/* RIGHT FORMS: 8/12 width */}
        <div className="lg:col-span-8 space-y-8 lg:space-y-12">
           {/* Primary Identity Form */}
           <form onSubmit={handleSave} className="neon-glass-card p-6 md:p-10 border border-white/5 relative group pb-12">
              <div className="flex items-center gap-4 mb-8">
                 <RiPencilLine size={24} className="text-primary-400" />
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Identity Configuration</h3>
              </div>

              <div className="space-y-10">
                <div className="relative">
                  <label className="text-[10px] text-primary-400 font-black uppercase tracking-widest mb-3 block opacity-70">Neural Biography</label>
                  <textarea
                    className="w-full bg-slate-900/50 border border-white/10 rounded-3xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none font-medium leading-relaxed"
                    rows={4} placeholder="Describe your mission, core skills, and career trajectory..."
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  {fields.map(({ id, label, placeholder, type, icon: Icon }) => (
                    <div key={id} className="group/field relative">
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 block group-focus-within/field:text-primary-400 transition-colors">{label}</label>
                      <div className="relative">
                        <Icon className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-700 text-xl group-focus-within/field:text-primary-400 transition-colors" />
                        <input
                          type={type || 'text'}
                          className="w-full bg-transparent border-b-2 border-white/5 pl-10 pr-4 py-4 text-white font-bold tracking-tight placeholder-slate-800 focus:outline-none focus:border-primary-500 transition-all"
                          placeholder={placeholder}
                          value={form[id]}
                          onChange={e => setForm({ ...form, [id]: e.target.value })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-16 flex justify-end">
                <button type="submit" disabled={saving} className="w-full sm:w-auto px-12 py-5 bg-white text-slate-950 font-black uppercase tracking-widest rounded-2xl hover:bg-primary-400 transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3 shadow-xl shadow-primary-500/10">
                  {saving ? (
                    <div className="w-5 h-5 border-4 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                  ) : saved ? (
                    <><RiCheckLine size={20} /> Identity Locked</>
                  ) : (
                    <><RiSaveLine size={20} /> Sync All Details</>
                  )}
                </button>
              </div>
           </form>

           {/* Neural Journal */}
           <CareerJournal />
        </div>
      </div>
    </div>
  );
}

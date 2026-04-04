import { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [editing, setEditing] = useState(null);
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
    motivated: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    focused: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    tired: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    frustrated: 'text-red-400 bg-red-500/10 border-red-500/20',
    proud: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
          <RiPencilLine className="text-white text-base" />
        </div>
        <div>
          <h3 className="font-bold text-white">Career Journal</h3>
          <p className="text-xs text-slate-500">Track your daily progress &amp; thoughts</p>
        </div>
        <span className="ml-auto text-xs text-slate-500">{entries.length} entries</span>
      </div>

      {/* Add entry */}
      <div className="mb-5 space-y-3">
        <div className="flex gap-2 flex-wrap mb-2">
          {moods.map(m => (
            <button key={m.key} onClick={() => setMood(m.key)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${mood === m.key ? moodColors[m.key] : 'border-white/5 text-slate-500 hover:border-white/10'}`}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addEntry(); } }}
            placeholder="What did you work on today? What did you learn?"
            rows={2}
            className="flex-1 bg-obsidian-700 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all resize-none text-sm"
          />
          <button onClick={addEntry} disabled={!input.trim()}
            className="w-11 h-11 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center disabled:opacity-40 hover:from-purple-500 hover:to-blue-500 transition-all self-end">
            <RiAddLine className="text-white text-lg" />
          </button>
        </div>
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-white/5 rounded-xl">
          <RiCalendarLine className="text-3xl text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No entries yet. Start journaling your progress!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {entries.map(entry => (
            <div key={entry.id} className="p-4 bg-obsidian-700/60 border border-white/5 rounded-xl group">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${moodColors[entry.mood]}`}>
                    {moods.find(m => m.key === entry.mood)?.emoji} {moods.find(m => m.key === entry.mood)?.label}
                  </span>
                  <span className="text-xs text-slate-500">{entry.date} · {entry.time}</span>
                </div>
                <button onClick={() => deleteEntry(entry.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all">
                  <RiDeleteBinLine size={14} />
                </button>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{entry.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
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
      axios.get('/api/profile').catch(() => ({ data: null })),
      axios.get('/api/resume').catch(() => ({ data: null })),
      axios.get('/api/github').catch(() => ({ data: null })),
      axios.get('/api/career/decision').catch(() => ({ data: null })),
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
      await axios.put('/api/profile', form);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const fields = [
    { id: 'targetRole', label: 'Target Role', placeholder: 'e.g. Full-Stack Developer', icon: RiBriefcaseLine },
    { id: 'location', label: 'Location', placeholder: 'e.g. Mumbai, India', icon: RiMapPinLine },
    { id: 'experience', label: 'Years of Experience', placeholder: '0', type: 'number', icon: RiTimeLine },
    { id: 'education', label: 'Education', placeholder: 'e.g. B.Tech Computer Science', icon: RiBookOpenLine },
    { id: 'githubUsername', label: 'GitHub Username', placeholder: 'yourhandle', icon: RiGithubLine },
    { id: 'linkedinUrl', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...', icon: RiLinkedinBoxLine },
    { id: 'portfolioUrl', label: 'Portfolio URL', placeholder: 'https://yoursite.com', icon: RiGlobalLine },
  ];

  const completedModules = [!!stats.resume, !!stats.github, !!stats.decision].filter(Boolean).length;

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
          <RiUserLine className="text-xl text-obsidian-900" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Your Profile</h1>
          <p className="text-slate-400 text-sm">Manage your identity &amp; track your career journey</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Avatar + Stats */}
        <div className="space-y-5">
          {/* Avatar Card */}
          <div className="glass-card p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gold-500 to-orange-500 rounded-3xl flex items-center justify-center text-obsidian-900 text-5xl font-black shadow-2xl shadow-gold-500/30 mx-auto mb-4">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-white font-black text-xl">{user?.name}</h2>
            <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
            {form.targetRole && (
              <span className="inline-block mt-2 px-3 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded-full text-xs font-bold">
                {form.targetRole}
              </span>
            )}
            {form.location && (
              <p className="text-slate-500 text-xs mt-2 flex items-center justify-center gap-1">
                <RiMapPinLine className="text-slate-400" /> {form.location}
              </p>
            )}
          </div>

          {/* Platform Stats */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Platform Progress</h3>
            <div className="space-y-3">
              {/* DevGap Score */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1"><RiSparklingLine className="text-gold-400" />DevGap Score</span>
                  <span className="text-gold-400 font-bold">{stats.devGapScore}/100</span>
                </div>
                <div className="h-2 bg-obsidian-600 rounded-full overflow-hidden">
                  <div style={{ width: `${stats.devGapScore}%`, transition: 'width 1.2s ease-out' }}
                    className="h-full bg-gradient-to-r from-gold-500 to-orange-500 rounded-full" />
                </div>
              </div>
              {/* Modules */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1"><RiCheckLine className="text-emerald-400" />Modules Done</span>
                  <span className="text-emerald-400 font-bold">{completedModules}/3</span>
                </div>
                <div className="h-2 bg-obsidian-600 rounded-full overflow-hidden">
                  <div style={{ width: `${(completedModules / 3) * 100}%`, transition: 'width 1.2s ease-out' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Module status pills */}
            <div className="mt-4 space-y-2">
              {[
                { label: 'Resume Uploaded', done: !!stats.resume, path: '/resume', icon: RiFileTextLine },
                { label: 'GitHub Analyzed', done: !!stats.github, path: '/github', icon: RiGithubLine },
                { label: 'Career Decided', done: !!stats.decision, path: '/career-decision', icon: RiSparklingLine },
              ].map(({ label, done, path, icon: Icon }) => (
                <Link key={label} to={path}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${done ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'}`}>
                  <Icon className={`text-sm ${done ? 'text-emerald-400' : 'text-slate-600'}`} />
                  {label}
                  {done && <RiCheckLine className="ml-auto text-emerald-400" />}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Nav */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Links</h3>
            <div className="space-y-1">
              {[
                { label: 'Mentor Mode', path: '/mentor-mode', icon: RiPsychotherapyLine, color: 'text-purple-400' },
                { label: 'Learning Roadmap', path: '/roadmap', icon: RiRoadMapLine, color: 'text-blue-400' },
                { label: 'Job Trends', path: '/trends', icon: RiFireLine, color: 'text-orange-400' },
              ].map(({ label, path, icon: Icon, color }) => (
                <Link key={path} to={path}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group text-sm text-slate-400 hover:text-white">
                  <Icon className={`${color} text-base`} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Edit Form + Journal */}
        <div className="lg:col-span-2 space-y-5">
          {/* Edit Form */}
          <form onSubmit={handleSave} className="glass-card p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 mb-2">
              <RiPencilLine className="text-gold-400" /> Edit Details
            </h3>

            <div>
              <label className="label-gold">Bio</label>
              <textarea
                className="input-dark resize-none"
                rows={3} placeholder="Tell us about yourself and your career goals..."
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(({ id, label, placeholder, type, icon: Icon }) => (
                <div key={id}>
                  <label className="label-gold">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input
                      type={type || 'text'}
                      className="input-dark pl-9"
                      placeholder={placeholder}
                      value={form[id]}
                      onChange={e => setForm({ ...form, [id]: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" disabled={saving} className="btn-gold w-full flex items-center justify-center gap-2 mt-2">
              {saving ? (
                <div className="w-5 h-5 border-2 border-obsidian-900/50 border-t-obsidian-900 rounded-full animate-spin" />
              ) : saved ? (
                <><RiCheckLine /> Profile Saved!</>
              ) : (
                <><RiSaveLine /> Save Profile</>
              )}
            </button>
          </form>

          {/* Career Journal */}
          <CareerJournal />
        </div>
      </div>
    </div>
  );
}

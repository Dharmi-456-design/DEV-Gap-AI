import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  RiSparklingLine, RiEyeLine, RiEyeOffLine, RiPsychotherapyLine,
  RiGithubLine, RiFileTextLine, RiRoadMapLine, RiArrowRightLine
} from 'react-icons/ri';

const FEATURES = [
  { icon: RiPsychotherapyLine, color: 'text-purple-400', bg: 'bg-purple-500/10', title: 'Mentor Mode', desc: 'Emotionally intelligent career coach' },
  { icon: RiGithubLine, color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'GitHub Analyzer', desc: 'Deep portfolio intelligence' },
  { icon: RiFileTextLine, color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'Resume AI', desc: 'Recruiter-level feedback' },
  { icon: RiRoadMapLine, color: 'text-gold-400', bg: 'bg-gold-500/10', title: 'Smart Roadmap', desc: 'Personalized learning path' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 flex relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold-500/[0.04] rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/[0.05] rounded-full blur-[100px] pointer-events-none translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-orange-500/[0.03] rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Left panel — branding + features (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/30">
            <RiSparklingLine className="text-xl text-obsidian-900" />
          </div>
          <div>
            <h1 className="font-black text-white text-lg leading-none">DevGap<span className="text-gold-400"> AI</span></h1>
            <p className="text-xs text-slate-500">Career Intelligence</p>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Know your gaps.<br />
            <span className="bg-gradient-to-r from-gold-400 to-orange-400 bg-clip-text text-transparent">Close them.</span><br />
            Get hired.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm">
            The only platform that gives you brutally honest, AI-powered career analysis — no fluff, no false hope.
          </p>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className={`p-4 rounded-2xl ${bg} border border-white/5`}>
                <Icon className={`${color} text-xl mb-2`} />
                <p className="text-white font-bold text-sm">{title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
          <p className="text-slate-300 text-sm italic leading-relaxed">
            "DevGap AI told me things no one else would — and it was exactly what I needed to hear."
          </p>
          <p className="text-slate-500 text-xs mt-2">— Beta User, hired in 4 months</p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-gold-500/30">
              <RiSparklingLine className="text-2xl text-obsidian-900" />
            </div>
            <h1 className="text-2xl font-black text-white">DevGap<span className="text-gold-400"> AI</span></h1>
          </div>

          <div className="glass-card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">Welcome back</h2>
              <p className="text-slate-400 text-sm mt-1">Sign in to your career dashboard</p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <span className="text-red-500">⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-gold">Email Address</label>
                <input
                  id="login-email"
                  type="email" required className="input-dark"
                  placeholder="you@example.com"
                  value={form.email}
                  autoComplete="email"
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label-gold">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'} required className="input-dark pr-12"
                    placeholder="••••••••"
                    value={form.password}
                    autoComplete="current-password"
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gold-400 transition-colors">
                    {showPwd ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                  </button>
                </div>
              </div>
              <button
                id="login-submit"
                type="submit" disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 mt-2">
                {loading
                  ? <div className="w-5 h-5 border-2 border-obsidian-900/50 border-t-obsidian-900 rounded-full animate-spin" />
                  : <><span>Sign In</span><RiArrowRightLine /></>
                }
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-obsidian-800 px-3 text-xs text-slate-500">New to DevGap AI?</span>
              </div>
            </div>

            <Link to="/register"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-white/10 rounded-xl text-slate-300 text-sm font-medium hover:border-gold-500/40 hover:text-gold-400 transition-all">
              Create free account <RiArrowRightLine />
            </Link>
          </div>

          <p className="text-center text-slate-600 text-xs mt-4">
            Demo: Register with any email &amp; password to explore
          </p>
        </div>
      </div>
    </div>
  );
}


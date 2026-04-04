import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { RiSparklingLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Server is NOT responding. Please ensure the backend is running on port 5000.');
      } else {
        const msg = err.response.data.errors?.[0]?.msg || err.response.data.message || 'Registration failed';
        setError(msg);
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <RiSparklingLine className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">DevGap AI</span>
          </h1>
          <p className="text-slate-500 text-sm">Start your career intelligence journey</p>
        </div>

        <div className="neon-glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6">Create your account</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-primary">Full Name</label>
              <input type="text" required className="input-dark" placeholder="Alex Johnson"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label-primary">Email</label>
              <input type="email" required className="input-dark" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label-primary">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} required className="input-dark pr-12"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-400 transition-colors">
                  {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 font-semibold hover:text-secondary-400 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

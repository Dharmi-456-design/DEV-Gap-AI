import { Link } from 'react-router-dom';

const features = [
  {
    title: 'AI Career Mentor',
    description: 'Get real-time feedback and guidance on your career path with our advanced LLM mentor.',
    icon: (
      <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Adaptive Roadmaps',
    description: 'Dynamic learning paths that evolve based on your progress and industry trends.',
    icon: (
      <svg className="w-8 h-8 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Smart Mock Tests',
    description: 'Practice with AI-generated interviews tailored to your specific role and experience level.',
    icon: (
      <svg className="w-8 h-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex justify-between items-center neon-glass-card mt-4 mb-10 rounded-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center animate-pulse-glow">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
            DevGap AI
          </span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="btn-ghost">Log In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 mt-10">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-sm font-semibold tracking-wide animate-fade-in backdrop-blur-md">
          <span className="animate-pulse mr-2 inline-block w-2 h-2 bg-primary-400 rounded-full"></span>
          Now in Public Beta
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-slide-up leading-tight tracking-tight">
          Supercharge your <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 animate-pulse-glow">
            Tech Career Journey
          </span>
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          An intelligent platform that analyzes your skills, generates adaptive roadmaps, and prepares you with AI-driven mock interviews to land your dream job faster.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
            Start for Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a href="#features" className="btn-ghost text-lg px-8 py-4">
            Explore Features
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl font-bold text-white mb-4">Why DevGap AI?</h2>
          <p className="text-slate-500">Everything you need to master your tech career in one platform.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div key={idx} className="neon-glass-card-hover p-8 rounded-2xl flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
              <div className="w-16 h-16 mb-6 bg-slate-900/60 rounded-2xl flex items-center justify-center glow-primary backdrop-blur-sm border border-white/5">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-auto py-8 text-center text-slate-400 relative z-10 bg-slate-900/40 backdrop-blur-md">
        <p>© {new Date().getFullYear()} DevGap AI. Hackathon Edition.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

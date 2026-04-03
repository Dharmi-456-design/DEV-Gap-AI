import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiBrainLine, RiArrowRightLine, RiArrowLeftLine, RiCheckLine, RiSparklingLine } from 'react-icons/ri';

const steps = [
  {
    id: 'primaryGoal', title: 'What is your #1 goal?', subtitle: 'Be honest — this drives your entire recommendation',
    type: 'choice',
    options: [
      { value: 'salary', label: '💰 Maximum Salary', desc: 'I want to earn as much as possible, fast' },
      { value: 'passion', label: '❤️ Follow Passion', desc: 'I want to love what I do every day' },
      { value: 'fast_job', label: '⚡ Get Job Fast', desc: 'I need employment within months' },
      { value: 'stability', label: '🏛️ Stability & Security', desc: 'I want a safe, long-term career' },
    ]
  },
  {
    id: 'interest', title: 'What excites you most?', subtitle: 'Your natural strengths define your path',
    type: 'choice',
    options: [
      { value: 'coding', label: '💻 Building & Coding', desc: 'I love creating things with code' },
      { value: 'design', label: '🎨 Design & Visuals', desc: 'I thrive making things look beautiful' },
      { value: 'communication', label: '🗣️ People & Communication', desc: 'I excel at connecting and leading' },
      { value: 'management', label: '📊 Strategy & Management', desc: 'I like planning and decision-making' },
    ]
  },
  {
    id: 'riskTolerance', title: 'Your risk tolerance?', subtitle: 'High risk paths have higher rewards but more failure',
    type: 'choice',
    options: [
      { value: 'low', label: '🛡️ Low Risk', desc: 'I prefer safe, predictable paths' },
      { value: 'medium', label: '⚖️ Medium Risk', desc: 'Calculated risks are fine' },
      { value: 'high', label: '🚀 High Risk', desc: 'I\'ll bet big for massive rewards' },
    ]
  },
  {
    id: 'workPreference', title: 'How do you prefer to work?', subtitle: 'This affects job eligibility and opportunities',
    type: 'choice',
    options: [
      { value: 'remote', label: '🏠 Fully Remote', desc: 'Work from anywhere in the world' },
      { value: 'hybrid', label: '🔄 Hybrid', desc: 'Mix of office and remote' },
      { value: 'onsite', label: '🏢 Office / On-site', desc: 'I prefer an office environment' },
    ]
  },
  {
    id: 'sliders', title: 'Rate your current state', subtitle: 'Honest self-assessment leads to better recommendations',
    type: 'sliders',
    sliders: [
      { id: 'communicationLevel', label: '🗣️ Communication Level', desc: 'How well do you communicate professionally?' },
      { id: 'confidenceLevel', label: '💪 Confidence Level', desc: 'How confident are you in your abilities?' },
      { id: 'patienceLevel', label: '⏳ Patience Level', desc: 'How long can you stay consistent without results?' },
    ]
  },
];

export default function CareerIntentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    primaryGoal: '', interest: '', riskTolerance: '', workPreference: '',
    communicationLevel: 5, confidenceLevel: 5, patienceLevel: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const canNext = () => {
    if (current.type === 'choice') return !!answers[current.id];
    return true;
  };

  const handleNext = async () => {
    if (!isLast) { setStep(s => s + 1); return; }
    setLoading(true); setError('');
    try {
      await axios.post('/api/career/inputs', answers);
      const { data } = await axios.post('/api/career/analyze');
      navigate('/career-decision');
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-gold-500/30">
            <RiBrainLine className="text-2xl text-obsidian-900" />
          </div>
          <h1 className="text-2xl font-black text-white">User Intent Engine</h1>
          <p className="text-slate-400 text-sm mt-1">Answer honestly — the AI will be brutally truthful back</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-gold-500 to-orange-500' : 'bg-obsidian-700'}`} />
          ))}
        </div>

        {/* Card */}
        <div className="glass-card p-8 animate-slide-up">
          <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-2">Step {step + 1} of {steps.length}</p>
          <h2 className="text-2xl font-black text-white mb-1">{current.title}</h2>
          <p className="text-slate-400 text-sm mb-6">{current.subtitle}</p>

          {current.type === 'choice' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAnswers({ ...answers, [current.id]: opt.value })}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    answers[current.id] === opt.value
                      ? 'bg-gold-500/15 border-gold-500/50 shadow-lg shadow-gold-500/10'
                      : 'border-white/5 bg-obsidian-700/50 hover:border-white/15 hover:bg-obsidian-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-lg mb-1 block">{opt.label}</span>
                    {answers[current.id] === opt.value && (
                      <div className="w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <RiCheckLine className="text-obsidian-900 text-xs" />
                      </div>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs">{opt.desc}</p>
                </button>
              ))}
            </div>
          )}

          {current.type === 'sliders' && (
            <div className="space-y-6">
              {current.sliders.map(s => (
                <div key={s.id}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">{s.label}</p>
                      <p className="text-slate-400 text-xs">{s.desc}</p>
                    </div>
                    <span className="text-gold-400 font-black text-xl w-10 text-right">{answers[s.id]}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range" min="1" max="10" value={answers[s.id]}
                      onChange={e => setAnswers({ ...answers, [s.id]: Number(e.target.value) })}
                      className="w-full h-2 bg-obsidian-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-gold-500 [&::-webkit-slider-thumb]:to-orange-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>1 (Low)</span><span>5 (Mid)</span><span>10 (High)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex items-center gap-2">
                <RiArrowLeftLine /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canNext() || loading}
              className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-obsidian-900/50 border-t-obsidian-900 rounded-full animate-spin" />Analyzing...</>
              ) : isLast ? (
                <><RiSparklingLine />Generate Career Decision</>
              ) : (
                <>Next <RiArrowRightLine /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RiRoadMapLine, RiPlayCircleLine, RiCheckLine, RiCodeLine, RiMessage2Line, RiBriefcaseLine, RiGlobalLine, RiPsychotherapyLine, RiTerminalBoxLine, RiArrowRightSLine, RiStarLine } from 'react-icons/ri';
import { SiHackerrank, SiLeetcode } from 'react-icons/si';

const categoryConfig = {
  coding: { label: 'Coding', icon: RiCodeLine, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  communication: { label: 'Communication', icon: RiMessage2Line, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  project: { label: 'Project', icon: RiBriefcaseLine, color: 'text-gold-400', bg: 'bg-gold-500/10' },
  real_world: { label: 'Real World', icon: RiGlobalLine, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revealPlatforms, setRevealPlatforms] = useState({});

  const toggleReveal = (phaseId) => {
    // Micro-interaction sound fallback
    try {
      const audio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
      audio.volume = 0.1;
      audio.play().catch(()=>{});
    } catch(e) {}
    setRevealPlatforms(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  useEffect(() => {
    axios.get('/api/roadmap').then(r => { 
      if (r.data) {
        setRoadmap(r.data); 
        // Auto-migrate old roadmaps to the new HackerRank/SoloLearn API structure
        if (r.data.phases && r.data.phases.length > 0 && !r.data.phases[0].interviewQuestions) {
          handleGenerate();
        }
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await axios.post('/api/roadmap/generate');
      setRoadmap(data);
    } catch (err) { console.error(err); }
    finally { setGenerating(false); }
  };

  const toggleTask = async (phaseIndex, taskIndex, current) => {
    try {
      const { data } = await axios.patch('/api/roadmap/task', { phaseIndex, taskIndex, completed: !current });
      setRoadmap(data);
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
            <RiRoadMapLine className="text-xl text-obsidian-900" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Learning Roadmap</h1>
            <p className="text-slate-400 text-sm">Personalized step-by-step career path with videos</p>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={generating} className="btn-gold flex items-center gap-2 text-sm">
          {generating ? <div className="w-4 h-4 border-2 border-obsidian-900/50 border-t-obsidian-900 rounded-full animate-spin" /> : '⚡'} Generate
        </button>
      </div>

      {!roadmap ? (
        <div className="glass-card p-16 text-center">
          <RiRoadMapLine className="text-7xl text-slate-700 mx-auto mb-5" />
          <h2 className="text-xl font-bold text-white mb-3">No Roadmap Generated Yet</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Complete the Career Intent Engine first, then generate your personalized roadmap with tasks and YouTube learning videos.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/career-intent" className="btn-ghost">Complete Intent Engine</Link>
            <button onClick={handleGenerate} disabled={generating} className="btn-gold flex items-center gap-2">
              {generating ? <div className="w-4 h-4 border-2 border-obsidian-900/50 border-t-obsidian-900 rounded-full animate-spin" /> : '🚀'} Generate Roadmap
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Mentor Greeting */}
          <div className="relative p-6 bg-obsidian-800/80 border border-purple-500/30 rounded-2xl animate-slide-up shadow-xl shadow-purple-500/10">
            <div className="absolute -top-5 left-6 w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <RiPsychotherapyLine className="text-white text-xl" />
            </div>
            <p className="text-purple-400 font-bold text-sm mt-3 mb-2 uppercase tracking-wider">The Truth About Becoming a {roadmap.targetRole}</p>
            <p className="text-slate-200 text-base leading-relaxed">
              {roadmap.mentorGreeting || "This isn't going to be easy. If you want results, you must follow this exactly. No skipping."}
            </p>
          </div>

          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-white/5"></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Your Brutal Action Plan</p>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          {/* Phase Stack */}
          <div className="space-y-8">
            {roadmap.phases?.map((phase, i) => (
              <div key={i} className="glass-card overflow-hidden animate-slide-up relative" style={{ animationDelay: `${i * 100}ms` }}>
                
                {/* Mentor's Direct Instruction for the phase */}
                <div className="p-6 bg-gradient-to-r from-purple-900/40 to-obsidian-900 border-b border-white/5">
                  <div className="flex items-start gap-4">
                    <span className="text-5xl font-black text-purple-500/20 leading-none">{phase.phase}</span>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">{phase.title}</h3>
                      <p className="text-xs text-slate-400 mb-3 font-semibold tracking-wide">DURATION: {phase.duration.toUpperCase()}</p>
                      
                      {phase.mentorMessage && (
                        <div className="p-4 bg-obsidian-950/50 border-l-4 border-purple-500 rounded-r-xl">
                          <p className="text-purple-100 text-sm italic leading-relaxed">
                            "{phase.mentorMessage}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tasks & Resources */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Task List */}
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">Mandatory Tasks</p>
                    {phase.tasks.map((task, ti) => {
                      const cat = categoryConfig[task.category] || categoryConfig.coding;
                      return (
                        <div
                          key={ti}
                          onClick={() => toggleTask(i, ti, task.completed)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                            task.completed
                              ? 'bg-emerald-500/5 border-emerald-500/20 opacity-75'
                              : 'border-white/5 bg-obsidian-700/30 hover:border-gold-500/20 hover:bg-obsidian-700/60'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                            task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'
                          }`}>
                            {task.completed && <RiCheckLine className="text-white text-xs" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>{task.task}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${cat.bg} ${cat.color} uppercase tracking-wider`}>
                            {cat.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Practice & Testing */}
                  <div className="space-y-6">
                    {/* Practice Platforms */}
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <RiTerminalBoxLine className="text-lg" /> Practice Platforms
                      </p>
                      <div className="space-y-3">
                        {phase.practiceLinks?.map((link, vi) => (
                          <div key={vi} className="flex flex-col p-4 bg-obsidian-800/80 border border-white/10 rounded-xl hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:-translate-y-0.5 transition-all duration-300">
                            <div className="flex items-start gap-4 mb-3">
                              <div className="p-2.5 bg-obsidian-950 border border-white/5 shadow-inner rounded-xl shrink-0">
                                {link.platform === 'HackerRank' ? <SiHackerrank className="text-[#00EA64] text-2xl" /> :
                                 link.platform === 'LeetCode' ? <SiLeetcode className="text-[#FFA116] text-2xl" /> :
                                 <RiTerminalBoxLine className="text-blue-400 text-2xl" />}
                              </div>
                              <div>
                                <h4 className="text-white text-sm font-bold tracking-wide">{link.name}</h4>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed pr-2">{link.description || 'Practice your coding logic instantly.'}</p>
                              </div>
                            </div>
                            <div className="mt-1 pt-3 border-t border-white/5">
                              <a href={link.url} target="_blank" rel="noopener noreferrer" 
                                 className="flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 group">
                                <span className="uppercase tracking-widest">Practice Now</span>
                                <RiArrowRightSLine className="text-lg group-hover:translate-x-1 transition-transform" />
                              </a>
                            </div>
                          </div>
                        ))}
                        {(!phase.practiceLinks || phase.practiceLinks.length === 0) && (
                          <p className="text-xs text-slate-500 italic p-4 bg-obsidian-800/30 rounded-xl border border-white/5">No specific platforms listed.</p>
                        )}
                      </div>

                      {/* Dynamic Hidden Reveal Container for Standard Platforms */}
                      {revealPlatforms[phase.phase] && (
                        <div className="mt-4 p-5 bg-gradient-to-br from-obsidian-800 to-obsidian-900 border border-gold-500/20 rounded-2xl animate-slide-up shadow-xl shadow-gold-500/5">
                          <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <RiStarLine className="animate-pulse" /> Core Recommendations
                          </p>
                          <div className="flex flex-col gap-3">
                            <a href="https://www.sololearn.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 bg-obsidian-950/50 rounded-xl border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group">
                              <RiTerminalBoxLine className="text-blue-400 text-2xl group-hover:scale-110 transition-transform" />
                              <div>
                                <h4 className="text-white text-sm font-bold">SoloLearn</h4>
                                <p className="text-slate-400 text-xs">Beginner-friendly coding practice</p>
                              </div>
                            </a>
                            <a href="https://www.hackerrank.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 bg-obsidian-950/50 rounded-xl border border-white/5 hover:border-[#00EA64]/50 hover:bg-[#00EA64]/10 transition-all group">
                              <SiHackerrank className="text-[#00EA64] text-2xl group-hover:scale-110 transition-transform" />
                              <div>
                                <h4 className="text-white text-sm font-bold">HackerRank</h4>
                                <p className="text-slate-400 text-xs">Skill testing and coding challenges</p>
                              </div>
                            </a>
                            <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 bg-obsidian-950/50 rounded-xl border border-white/5 hover:border-[#FFA116]/50 hover:bg-[#FFA116]/10 transition-all group">
                              <SiLeetcode className="text-[#FFA116] text-2xl group-hover:scale-110 transition-transform" />
                              <div>
                                <h4 className="text-white text-sm font-bold">LeetCode</h4>
                                <p className="text-slate-400 text-xs">Advanced problem-solving and interview preparation</p>
                              </div>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Test Your Knowledge */}
                    <div className="space-y-3">
                      <button 
                        onClick={() => toggleReveal(phase.phase)} 
                        className="group flex items-center gap-2 w-full text-left text-xs font-bold text-pink-400 uppercase tracking-wider mb-2 focus:outline-none active:scale-95 transition-transform origin-left">
                        Test Your Knowledge 
                        <RiArrowRightSLine className={`text-lg transition-transform duration-300 ${revealPlatforms[phase.phase] ? 'rotate-90 text-gold-400' : 'group-hover:translate-x-1'}`} />
                      </button>
                      <div className="space-y-2">
                        {phase.interviewQuestions?.map((q, qi) => (
                          <a key={qi} href={q.url} target="_blank" rel="noopener noreferrer"
                             className="block p-3 bg-obsidian-800/50 border border-white/5 rounded-xl border-l-2 border-l-pink-500/50 hover:bg-pink-500/10 hover:border-pink-500/30 transition-all duration-200 group">
                            <div className="flex justify-between items-center">
                              <p className="text-slate-200 text-xs font-medium leading-relaxed group-hover:text-white transition-colors">{q.question}</p>
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 ml-3 whitespace-nowrap">{q.platform} ↗</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RiRoadMapLine, RiPlayCircleLine, RiCheckLine, RiCodeLine, RiMessage2Line, RiBriefcaseLine, RiGlobalLine, RiPsychotherapyLine, RiTerminalBoxLine, RiArrowRightSLine, RiStarLine, RiFlashlightLine, RiArrowRightLine } from 'react-icons/ri';
import { SiHackerrank, SiLeetcode } from 'react-icons/si';

const categoryConfig = {
  coding: { label: 'Coding', icon: RiCodeLine, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  communication: { label: 'Communication', icon: RiMessage2Line, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  project: { label: 'Project', icon: RiBriefcaseLine, color: 'text-primary-400', bg: 'bg-primary-500/10' },
  real_world: { label: 'Real World', icon: RiGlobalLine, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revealPlatforms, setRevealPlatforms] = useState({});

  const toggleReveal = (phaseId) => {
    setRevealPlatforms(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  useEffect(() => {
    axios.get('/api/roadmap').then(r => { 
      if (r.data) {
        setRoadmap(r.data); 
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
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto animate-fade-in space-y-10 pb-24">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-[1.2rem] flex items-center justify-center shadow-2xl shadow-primary-500/30 ring-4 ring-white/5">
            <RiRoadMapLine className="text-2xl text-slate-900" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter uppercase">Elite Roadmap</h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Multi-Phase Execution Strategy</p>
          </div>
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={generating} 
          className="w-full md:w-auto px-8 py-4 bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-primary-400 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl"
        >
          {generating ? <div className="w-4 h-4 border-4 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" /> : <RiFlashlightLine size={18} />} 
          Synthesize New Path
        </button>
      </div>

      {!roadmap ? (
        <div className="neon-glass-card p-12 md:p-24 text-center border border-white/5 bg-slate-900/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none" />
          <RiRoadMapLine className="text-8xl text-slate-800 mx-auto mb-8 animate-pulse" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">No Trajectory Defined</h2>
          <p className="text-slate-500 text-sm md:text-base mb-10 max-w-lg mx-auto font-medium">
            Our engines require your <strong className="text-primary-400">Career Intent Profile</strong> to calculate your optimal learning path and YouTube curriculum.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/career-intent" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Configure Intent</Link>
            <button onClick={handleGenerate} disabled={generating} className="px-8 py-4 bg-primary-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all">
               Initialize Sync
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Legend / Status */}
          <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
             {Object.entries(categoryConfig).map(([key, config]) => (
                <div key={key} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 ${config.bg} ${config.color} text-[9px] font-black uppercase tracking-widest`}>
                   <config.icon /> {config.label}
                </div>
             ))}
          </div>

          {/* Roadmap Stack */}
          <div className="space-y-16 relative">
            {/* Thread Line */}
            <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary-500/30 via-slate-800 to-transparent hidden md:block" />

            {roadmap.phases?.map((phase, i) => (
              <div key={i} className="relative group scroll-mt-20">
                {/* Phase Marker */}
                <div className="absolute left-0 top-0 w-14 h-14 bg-slate-900 border-4 border-slate-950 rounded-2xl hidden md:flex items-center justify-center z-10 group-hover:border-primary-500/50 transition-colors shadow-2xl">
                   <span className="text-xl font-black text-white">{i + 1}</span>
                </div>

                <div className="md:ml-24 space-y-6">
                   {/* Phase Header */}
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 md:p-10 rounded-3xl bg-slate-900/60 border border-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none" />
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center gap-3">
                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Phase {phase.phase}: {phase.title}</h3>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{phase.duration}</span>
                         </div>
                         {phase.mentorMessage && (
                            <div className="text-sm text-slate-400 font-medium leading-relaxed italic border-l-2 border-primary-500/30 pl-4 py-1">
                               "{phase.mentorMessage}"
                            </div>
                         )}
                      </div>
                   </div>

                   {/* Tasks & Practice Nodes */}
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Task Checklist */}
                      <div className="neon-glass-card p-6 md:p-8 border border-white/5 space-y-6">
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Mandatory Objectives</p>
                         <div className="space-y-3">
                            {phase.tasks.map((task, ti) => {
                               const cat = categoryConfig[task.category] || categoryConfig.coding;
                               return (
                                 <button
                                   key={ti}
                                   onClick={() => toggleTask(i, ti, task.completed)}
                                   className={`w-full group flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${
                                     task.completed ? 'bg-emerald-500/5 border-emerald-500/20 opacity-40' : 'bg-slate-950/40 border-white/5 hover:border-white/20'
                                   }`}
                                 >
                                   <div className={`w-5 h-5 rounded-lg border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 group-hover:border-primary-500/50'}`}>
                                      {task.completed && <RiCheckLine size={12} className="text-slate-900 font-black" />}
                                   </div>
                                   <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-bold tracking-tight ${task.completed ? 'text-slate-600 line-through' : 'text-slate-200'}`}>{task.task}</p>
                                      <span className={`inline-block mt-2 px-3 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${cat.bg} ${cat.color}`}>{cat.label}</span>
                                   </div>
                                 </button>
                               );
                            })}
                         </div>
                      </div>

                      {/* External Intelligence (LeetCode/HackerRank/YT) */}
                      <div className="space-y-6">
                         {/* Practice Nodes */}
                         <div className="neon-glass-card p-6 md:p-8 border border-blue-500/10">
                            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-6">Neural Practice Nodes</p>
                            <div className="space-y-4">
                               {phase.practiceLinks?.map((link, li) => (
                                  <a key={li} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-4 bg-slate-950/60 border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                                     <div className="w-12 h-12 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center text-2xl group-hover:bg-slate-800">
                                        {link.platform === 'HackerRank' ? <SiHackerrank className="text-emerald-400" /> : <SiLeetcode className="text-amber-500" />}
                                     </div>
                                     <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-black text-sm uppercase tracking-tighter truncate">{link.name}</h4>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">{link.platform} Challenge</p>
                                     </div>
                                     <RiArrowRightLine className="text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                  </a>
                               ))}
                            </div>
                         </div>

                         {/* Knowledge Reveal */}
                         <div className="neon-glass-card p-6 md:p-8 border border-pink-500/10 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                               <p className="text-[10px] text-pink-500 font-black uppercase tracking-[0.2em]">Interview Synthesis</p>
                               <button onClick={() => toggleReveal(phase.phase)} className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                                  {revealPlatforms[phase.phase] ? 'Collapse' : 'Expand'} <RiArrowRightSLine className={`text-lg transition-transform ${revealPlatforms[phase.phase] ? 'rotate-90' : ''}`} />
                               </button>
                            </div>
                            
                            <div className={`space-y-3 transition-all duration-500 overflow-hidden ${revealPlatforms[phase.phase] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                               {phase.interviewQuestions?.map((q, qi) => (
                                 <a key={qi} href={q.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-950/40 border border-white/5 rounded-2xl hover:border-pink-500/40 group">
                                    <div className="flex items-start justify-between gap-4">
                                       <p className="text-slate-300 text-xs font-bold leading-relaxed group-hover:text-white">{q.question}</p>
                                       <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-pink-500/10 text-pink-400 rounded-lg shrink-0">{q.platform}</span>
                                    </div>
                                 </a>
                               ))}
                            </div>
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

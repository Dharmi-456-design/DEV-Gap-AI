import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RiRoadMapLine, RiLockUnlockLine, RiArrowDownSLine, RiArrowUpSLine,
  RiCheckDoubleLine, RiAlertFill, RiTerminalWindowLine, RiYoutubeLine,
  RiPsychotherapyLine, RiFireLine, RiExternalLinkLine, RiShieldLine
} from 'react-icons/ri';

export default function AdaptiveRoadmapPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState({});

  const togglePhase = (index) => {
    setExpandedPhases(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/adaptive-roadmap/generate', {});
      setData(response.data);
      if (response.data.phases && response.data.phases.length > 0) {
          setExpandedPhases({ 0: true }); // auto-expand first
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/50 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/20">
          <RiPsychotherapyLine className="text-5xl text-purple-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 text-center">Mentor-Driven Roadmap</h1>
        <p className="text-slate-500 text-center max-w-xl mb-10 leading-relaxed">
          Stop following generic tutorials. Generate a brutally honest, real-world execution plan based on your DevGap score, missing skills, and weak topics. This is how seniors train juniors.
        </p>

        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center gap-3 px-8 py-4 text-base rounded-2xl hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg hover:shadow-purple-500/20 active:scale-95"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : <RiFireLine className="text-xl" />}
          {loading ? 'Consulting Mentor...' : 'Generate My Execution Plan'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold mb-3">
            <RiPsychotherapyLine /> SENIOR MENTOR MODE
          </div>
          <h1 className="text-3xl font-black text-white mb-2">{data.roadmap_title}</h1>
          <p className="text-slate-500 text-sm">Target Role: <strong className="text-white bg-slate-900/40/5 px-2 py-0.5 rounded ml-1">{data.target_role}</strong></p>
        </div>
        <button onClick={handleGenerate} className="px-5 py-2.5 bg-slate-900/40 border border-white/10 hover:border-purple-500/50 text-slate-300 hover:text-purple-400 rounded-xl transition-all text-sm font-bold flex items-center justify-center gap-2">
           Re-evaluate Plan
        </button>
      </div>

      {/* DevGap Reality Check Banner */}
      {data.show_reality_warning && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-red-950/80 to-slate-900 border-l-4 border-l-red-500 border border-red-500/20 shadow-xl shadow-red-500/5 items-center flex gap-4 animate-slide-up">
           <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500 text-2xl">
             <RiAlertFill />
           </div>
           <div>
              <p className="text-red-400 font-bold text-sm tracking-wider uppercase mb-1">Reality Check (Score: {data.devGapScore}/100)</p>
              <p className="text-slate-200 text-sm leading-relaxed">{data.reality_check}</p>
           </div>
        </div>
      )}
      {!data.show_reality_warning && (
         <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border-l-4 border-l-emerald-500 border border-emerald-500/20 shadow-xl shadow-emerald-500/5 items-center flex gap-4 animate-slide-up">
           <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 text-2xl">
             <RiShieldLine />
           </div>
           <div>
              <p className="text-emerald-400 font-bold text-sm tracking-wider uppercase mb-1">Solid Foundation (Score: {data.devGapScore}/100)</p>
              <p className="text-slate-200 text-sm leading-relaxed">{data.reality_check}</p>
           </div>
        </div>
      )}

      {/* Mentor Intro */}
      <div className="mb-10 px-6 py-5 bg-slate-900/40 border border-purple-500/30 rounded-2xl relative">
         <div className="absolute -top-4 -left-3 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg border-2 border-slate-900">
            <RiPsychotherapyLine className="text-lg" />
         </div>
         <p className="text-white text-[15px] italic leading-relaxed ml-4">
            "{data.mentor_intro}"
         </p>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {data.phases.map((phase, i) => {
          const isExpanded = expandedPhases[i];
          
          return (
            <div 
              key={i} 
              className="neon-glass-card overflow-hidden transition-all duration-300 border border-white/5 hover:border-purple-500/30 bg-slate-900/60"
            >
              <button 
                onClick={() => togglePhase(i)} 
                className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-800/[0.02] transition-colors focus:outline-none"
              >
                 <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-purple-500/20">{phase.phase_number}</span>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-wide">{phase.phase_title}</h2>
                    </div>
                 </div>
                 {isExpanded ? <RiArrowUpSLine className="text-slate-500 text-xl" /> : <RiArrowDownSLine className="text-slate-500 text-xl" />}
              </button>

              {isExpanded && (
                <div className="p-6 pt-0 border-t border-white/5 bg-slate-950/40">
                   
                   {/* Mentor Comment Highlight */}
                   <div className="mt-6 mb-6 p-4 rounded-xl border-l-2 border-l-purple-500 bg-purple-500/5">
                      <div className="flex gap-3">
                         <RiLockUnlockLine className="text-purple-400 text-lg flex-shrink-0 mt-0.5" />
                         <div>
                            <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">Mentor's Note</p>
                            <p className="text-slate-300 text-sm italic leading-relaxed">{phase.mentor_advice}</p>
                         </div>
                      </div>
                   </div>

                   {/* Content Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Tasks */}
                      <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <RiTerminalWindowLine className="text-blue-400" /> Action Items
                         </h4>
                         <div className="space-y-2">
                           {phase.tasks.map((task, idx) => (
                              <div key={idx} className="flex gap-3 p-3 bg-slate-900/60 border border-white/5 rounded-xl hover:border-white/20 transition-all">
                                 <RiCheckDoubleLine className="text-slate-400 mt-0.5" />
                                 <p className="text-sm text-slate-200">{task}</p>
                              </div>
                           ))}
                         </div>
                      </div>

                      {/* Resources */}
                      <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <RiYoutubeLine className="text-red-400" /> Curated Resources
                         </h4>
                         
                         <a 
                           href={phase.resources.youtube_video.url} 
                           target="_blank" rel="noopener noreferrer"
                           className="flex items-center justify-between p-3 mb-3 bg-red-400/5 border border-red-500/20 rounded-xl hover:bg-red-400/10 transition-colors group"
                         >
                            <div className="flex items-center gap-3 overflow-hidden">
                               <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0">
                                 <RiYoutubeLine />
                               </div>
                               <p className="text-sm font-bold text-slate-200 truncate group-hover:text-red-400 transition-colors">{phase.resources.youtube_video.title}</p>
                            </div>
                            <RiExternalLinkLine className="text-slate-400" />
                         </a>

                         <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 pl-1">Practice & Prove it</p>
                         <div className="grid grid-cols-2 gap-2">
                            {phase.resources.practice_links.map((link, idx) => (
                               <a 
                                 key={idx} 
                                 href={link.url} 
                                 target="_blank" rel="noopener noreferrer"
                                 className="flex items-center justify-between p-2.5 bg-slate-900/40 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
                               >
                                 <span className="text-xs font-semibold text-slate-300 group-hover:text-blue-400">{link.name}</span>
                                 <RiExternalLinkLine className="text-slate-400 text-xs" />
                               </a>
                            ))}
                         </div>
                      </div>

                   </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
      
    </div>
  );
}

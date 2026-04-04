import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RiMicLine, RiPlayFill, RiCheckDoubleLine, RiLightbulbFlashLine,
  RiHistoryLine, RiTrophyLine, RiQuestionAnswerLine, RiEmotionLine,
  RiBookOpenLine, RiErrorWarningLine, RiArrowLeftLine, RiUserVoiceLine,
  RiBookmarkLine, RiFeedbackLine, RiArrowRightSLine
} from 'react-icons/ri';

// Import the expanding 1000+ Question Bank
import { InterviewQuestionBank } from '../data/interviewQuestions';

export default function InterviewPrepPlatform() {
  const navigate = useNavigate();

  // Mode Selection State
  const [setupMode, setSetupMode] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Progress & History
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState({ practiced: 0, accuracyScore: 0, confidenceScore: 0 });

  // Active Problem State
  const [question, setQuestion] = useState(null);
  const [userResponse, setUserResponse] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Learning Mode State
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Stats Logic mapping
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('interview_prep_metrics'));
      if (saved) setMetrics(saved);
      const savedHist = JSON.parse(localStorage.getItem('interview_prep_history'));
      if (savedHist) setHistory(savedHist);
    } catch {}
  }, []);

  const saveMetrics = (m, h) => {
    localStorage.setItem('interview_prep_metrics', JSON.stringify(m));
    localStorage.setItem('interview_prep_history', JSON.stringify(h));
  };

  const startPractice = () => {
    const solvedIds = history.filter(h => h.status === 'Completed').map(h => h.id);

    // Initial Filter based on UI selections
    let available = InterviewQuestionBank.filter(q => {
       const diffMatch = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
       const catMatch = selectedCategory === "All" || q.category === selectedCategory;
       return diffMatch && catMatch;
    });

    // Sub-filter: Only select questions we haven't seen yet
    let unseen = available.filter(q => !solvedIds.includes(q.id));

    // If we've exhausted all matching questions, fallback safely
    if (unseen.length === 0) {
        if (available.length > 0) {
            unseen = available; // Loop back within the same category to re-practice
        } else {
            unseen = InterviewQuestionBank; // Complete fallback
        }
    }

    const nextProblem = unseen[Math.floor(Math.random() * unseen.length)];
    
    setQuestion(nextProblem);
    setUserResponse("");
    setEvaluation(null);
    setHintsRevealed(0);
    setShowAnswer(false);
    setSetupMode(false);
  };

  const evaluateResponse = () => {
    if (!userResponse || userResponse.length < 10) {
       alert("Please type a meaningful response (or use the simulated voice box) before evaluating.");
       return;
    }

    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      
      // Mock AI Evaluation Logic
      const wordCount = userResponse.split(' ').length;
      let clarity = 0;
      let conceptAcc = 0;
      let conf = 0;

      const lowerResp = userResponse.toLowerCase();
      let keywordsHit = 0;
      question.keyTopics.forEach(topic => {
          if (lowerResp.includes(topic.toLowerCase())) keywordsHit++;
      });

      conceptAcc = Math.min(100, Math.round((keywordsHit / question.keyTopics.length) * 100) + 40);
      if (wordCount > 15) clarity = 85; else clarity = 50;
      conf = Math.min(100, (clarity + conceptAcc) / 2 + 10);

      const strengths = [];
      const improvements = [];
      
      if (conceptAcc > 70) strengths.push("You hit the core technical keywords.");
      else improvements.push(`You missed critical terms like: ${question.keyTopics.join(', ')}.`);

      if (wordCount > 30) strengths.push("Response was adequately detailed.");
      else improvements.push("Response was a bit short. Try expanding using the STAR method or real examples.");

      improvements.push("Did not mention real-world example explicitly (Suggestion: Always give 1 use case).");

      setEvaluation({
         clarityScore: clarity,
         conceptAccuracy: conceptAcc,
         confidenceScore: conf,
         strengths,
         improvements
      });

      // Update metrics
      const newPracticed = metrics.practiced + 1;
      const newAcc = Math.round(((metrics.accuracyScore * metrics.practiced) + conceptAcc) / newPracticed) || conceptAcc;
      const newConf = Math.round(((metrics.confidenceScore * metrics.practiced) + conf) / newPracticed) || conf;
      
      const m = { practiced: newPracticed, accuracyScore: newAcc, confidenceScore: newConf };
      const h = [...history, { id: question.id, status: 'Completed', date: new Date().toISOString(), score: conf }];
      setMetrics(m);
      setHistory(h);
      saveMetrics(m, h);

      // Auto-reveal the answer for studying
      setShowAnswer(true);

    }, 2000);
  };

  // --- INITIAL MODE SELECTION (DASHBOARD) ---
  if (setupMode) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
           {/* Left Pane - Controls */}
           <div className="lg:col-span-2 neon-glass-card p-8 md:p-10 border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-500" />
              
              <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                <RiUserVoiceLine className="text-cyan-400" /> Interview Preparation Platform
              </h1>
              <p className="text-slate-500 mb-8">Professional Answer-Based Learning & Mock Interview Simulator</p>

              <div className="space-y-6 mb-8">
                 <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Select Category</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["All", "Data Structures", "Web Development", "HR Interview", "Database (SQL)", "System Design Basics", "Algorithms", "Behavioral"].map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          selectedCategory === cat 
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                            : 'bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/20'
                        }`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Select Difficulty</h3>
                    <div className="flex gap-3">
                      {["All", "Easy", "Intermediate", "Advanced"].map(diff => (
                        <button key={diff} onClick={() => setSelectedDifficulty(diff)} className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                          selectedDifficulty === diff 
                            ? (diff === 'Easy' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : diff === 'Intermediate' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : diff === 'Advanced' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-purple-500/20 text-purple-400 border-purple-500/50')
                            : 'bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/20'
                        }`}>
                          {diff}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>

              <button onClick={startPractice} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl text-white font-black text-lg shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2">
                <RiPlayFill className="text-2xl" /> Begin Interview Session
              </button>
           </div>

           {/* Right Pane - Metrics */}
           <div className="neon-glass-card p-6 h-full border-white/5 flex flex-col">
              <h3 className="section-title text-sm mb-4">Performance Dashboard</h3>
              
              <div className="space-y-4 mb-8">
                 <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">QUESTIONS PRACTICED</p>
                      <p className="text-white font-black text-2xl">{metrics.practiced}</p>
                    </div>
                    <RiQuestionAnswerLine className="text-3xl text-cyan-400 opacity-80" />
                 </div>
                 <div className="bg-slate-900/60 p-4 rounded-xl border border-purple-500/20 flex items-center justify-between shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <div>
                      <p className="text-[10px] uppercase text-purple-400 font-bold tracking-wider">INTERVIEW READINESS</p>
                      <p className="text-white font-black text-2xl">{metrics.accuracyScore}%</p>
                    </div>
                    <RiTrophyLine className="text-3xl text-purple-400 opacity-80" />
                 </div>
                 <div className="bg-slate-900/60 p-4 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase text-emerald-400 font-bold tracking-wider">CONFIDENCE SCORE</p>
                      <p className="text-white font-black text-2xl">{metrics.confidenceScore}%</p>
                    </div>
                    <RiEmotionLine className="text-3xl text-emerald-400 opacity-80" />
                 </div>
              </div>

              <div className="mt-auto">
                 <button onClick={() => navigate('/trends')} className="w-full py-3 bg-slate-900/40 text-white font-bold rounded-xl hover:bg-slate-800/5 transition flex justify-center items-center gap-2 text-sm">
                    <RiArrowLeftLine /> Exit to Dashboard
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- INTERVIEW PRACTICE ARENA ---
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 flex flex-col overflow-y-auto global-scrollbar">
      {/* Top Navbar */}
      <div className="h-16 border-b border-white/10 bg-slate-900/60 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <button onClick={() => setSetupMode(true)} className="text-slate-500 hover:text-white transition flex items-center gap-1 text-sm font-bold bg-slate-900/50 px-3 py-1.5 rounded-lg border border-white/5">
               <RiArrowLeftLine /> Leave
            </button>
            <div className="h-6 w-px bg-slate-900/80 hidden md:block" />
            <div className="flex flex-col">
              <span className="font-black text-white text-sm md:text-base hidden sm:block">{question.category} Interview</span>
              <span className="text-xs text-slate-400 font-medium">Difficulty: <span className="text-cyan-400">{question.difficulty}</span></span>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <button className="text-xs font-bold text-slate-500 hover:text-white border border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2">
                 <RiBookmarkLine /> Save Note
             </button>
             <button onClick={startPractice} className="text-xs font-bold text-white bg-cyan-400 hover:bg-cyan-300 px-4 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                 Next Question <RiArrowRightSLine />
             </button>
         </div>
      </div>

      <div className="max-w-6xl w-full mx-auto p-6 md:p-8 flex flex-col lg:flex-row gap-8">
         {/* LEFT PANE - Question & User Input (Simulated Interview Space) */}
         <div className="flex-1 flex flex-col gap-6">
            <div className="neon-glass-card p-6 md:p-8 border-cyan-500/20 shadow-[0_4px_30px_rgba(34,211,238,0.05)] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                  <span className="px-3 py-1 bg-slate-900/60 border border-white/10 rounded-full text-xs font-bold text-slate-500 flex items-center gap-1">
                    <RiFeedbackLine /> {question.category}
                  </span>
               </div>
               
               <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Interview Question</h3>
               <h2 className="text-2xl font-black text-white mb-6 leading-snug pr-20">{question.question}</h2>

               <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-white/5">Key Topics:</span>
                  {question.keyTopics.map((topic, i) => (
                    <span key={i} className="text-xs font-semibold text-slate-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">
                      {topic}
                    </span>
                  ))}
               </div>

               <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl border-l-4 border-l-primary-500 mb-2">
                  <p className="text-xs uppercase font-bold text-primary-400 mb-1">Expected Depth</p>
                  <p className="text-sm text-slate-300">{question.expectedDepth}</p>
               </div>
            </div>

            {/* Smart Hint System */}
            <div className="neon-glass-card p-6 border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-300 uppercase flex items-center gap-2">
                      <RiLightbulbFlashLine className="text-amber-400 text-lg" /> Smart Hints
                  </h3>
                </div>
                <div className="space-y-3">
                    {question.hints.map((hint, i) => (
                      <div key={i}>
                          {hintsRevealed >= i + 1 ? (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-sm animate-fade-in shadow-inner">
                              <span className="font-black mr-2 opacity-80">HINT {i+1}:</span> {hint}
                            </div>
                          ) : (
                            hintsRevealed === i && (
                              <button onClick={() => setHintsRevealed(r => r + 1)} className="w-full py-3 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-300 text-xs rounded-xl font-bold transition flex items-center justify-center gap-2 border border-dashed border-white/10 hover:border-amber-500/30">
                                  <RiLightbulbFlashLine /> Reveal Hint {i+1}
                              </button>
                            )
                          )}
                      </div>
                    ))}
                </div>
            </div>

            {/* User Response Area (Mock Interview Simulator) */}
            <div className="neon-glass-card p-6 border-white/5 flex flex-col pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <RiUserVoiceLine className="text-emerald-400" /> Your Response
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold tracking-wider">MOCK INTERVIEW MODE</span>
                </div>
                
                <textarea 
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your structured answer here, or click the mic button to simulate a voice response... Use the STAR method if applicable."
                  className="w-full h-40 bg-slate-900/60 border border-white/10 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 resize-none leading-relaxed mb-4"
                />

                <div className="flex items-center gap-3">
                  <button className="h-12 w-12 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors tooltip-trigger relative group">
                    <RiMicLine className="text-xl" />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/40 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Voice Mode (Coming Soon)</span>
                  </button>
                  <button 
                    onClick={evaluateResponse} 
                    disabled={isEvaluating}
                    className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-cyan-500 hover:brightness-110 rounded-xl text-white font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition flex items-center justify-center gap-2 disabled:opacity-50">
                    {isEvaluating ? 'AI Evaluating Response...' : (
                      <>Evaluate Response <RiCheckDoubleLine /></>
                    )}
                  </button>
                </div>
            </div>
         </div>

         {/* RIGHT PANE - Answer Learning Mode & Evaluation Feedback */}
         <div className="w-full lg:w-[450px] flex flex-col gap-6">
            {/* Show Answer / Feedback block */}
            {!showAnswer ? (
                <div className="neon-glass-card p-8 border-dashed border-white/10 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                  <RiBookOpenLine className="text-6xl text-slate-300 mx-auto mb-4" />
                  <h3 className="text-white font-black text-lg mb-2">Answer Learning Mode</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Submit your response to unlock the AI evaluation, or bypass it directly to study the optimal professional answer.
                  </p>
                  <button onClick={() => setShowAnswer(true)} className="w-full py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold rounded-xl flex items-center justify-center gap-2 transition">
                     <RiBookOpenLine /> Show Best Answer Now
                  </button>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                   {/* Evaluation Feedback Box (if they submitted one) */}
                   {evaluation && (
                      <div className="neon-glass-card p-6 border-emerald-500/30 bg-emerald-500/5 animate-slide-up shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                         <h3 className="text-emerald-400 font-black mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                           <RiCheckDoubleLine className="text-lg" /> Feedback Report
                         </h3>
                         <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="p-3 bg-slate-900/60 border border-white/5 rounded-lg text-center">
                              <p className="text-2xl font-black text-white">{evaluation.conceptAccuracy}%</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">Concept Accuracy</p>
                            </div>
                            <div className="p-3 bg-slate-900/60 border border-white/5 rounded-lg text-center">
                              <p className="text-2xl font-black text-cyan-400">{evaluation.confidenceScore}%</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">Confidence Spec</p>
                            </div>
                         </div>
                         <div className="space-y-3 text-sm">
                            <div>
                               <p className="text-emerald-400 font-bold mb-1 text-xs">Strengths:</p>
                               <ul className="list-disc pl-4 text-slate-300 text-xs space-y-1">
                                 {evaluation.strengths.map((s,i)=><li key={i}>{s}</li>)}
                               </ul>
                            </div>
                            <div>
                               <p className="text-red-400 font-bold mb-1 text-xs">Improvements Required:</p>
                               <ul className="list-disc pl-4 text-slate-300 text-xs space-y-1">
                                 {evaluation.improvements.map((s,i)=><li key={i}>{s}</li>)}
                               </ul>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* Optimal Answer View */}
                   <div className="neon-glass-card p-6 border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent relative animate-fade-in shadow-[0_0_40px_rgba(99,102,241,0.05)]">
                      <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl">MODEL ANSWER</div>
                      
                      <h3 className="text-sm font-bold text-white mb-2 mt-2">Professional Interview Answer</h3>
                      <p className="text-sm text-slate-300 leading-relaxed mb-6 p-4 bg-slate-900/60 border border-white/5 rounded-xl border-l-2 border-l-indigo-400">
                         "{question.bestAnswer}"
                      </p>

                      <h3 className="text-xs uppercase font-bold text-slate-400 mb-2">Simple Explanation</h3>
                      <p className="text-sm text-slate-500 mb-6 italic border-l-2 border-white/10 pl-3">
                         {question.simpleExplanation}
                      </p>

                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                         <h3 className="text-xs font-black text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                           <RiErrorWarningLine /> Common Mistake
                         </h3>
                         <p className="text-sm text-amber-200/80">{question.commonMistakes}</p>
                      </div>

                      <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl mb-6">
                         <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                           <RiLightbulbFlashLine /> Real Interview Tip
                         </h3>
                         <p className="text-sm text-cyan-100/80">{question.realInterviewTip}</p>
                      </div>

                      <div>
                         <h3 className="text-xs uppercase font-bold text-slate-400 mb-3 border-b border-white/10 pb-2">Possible Follow-Up Questions</h3>
                         <ul className="space-y-2">
                           {question.followUpQuestions.map((fq, i) => (
                             <li key={i} className="flex gap-2 text-sm text-slate-300">
                               <RiQuestionAnswerLine className="text-indigo-400 flex-shrink-0 mt-0.5" /> {fq}
                             </li>
                           ))}
                         </ul>
                      </div>
                   </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
}

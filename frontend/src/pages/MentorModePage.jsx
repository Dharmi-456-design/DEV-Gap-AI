import { useState, useRef, useEffect } from 'react';
import {
  RiSendPlaneFill, RiPsychotherapyLine, RiSparklingFill, RiArrowRightSLine,
  RiEmotionLine, RiFeedbackLine, RiCompassLine, RiFlagLine, RiTranslate2
} from 'react-icons/ri';

const MENTOR_AI = {
  en: {
    intro: "Relax. I’m not here to judge you.\n\nTell me honestly — what is actually confusing you right now?",
    input_placeholder: "Talk to me naturally...",
    suggestion_chips: [
      { t: "I feel confused", icon: RiEmotionLine },
      { t: "What should I learn?", icon: RiCompassLine },
      { t: "Am I job ready?", icon: RiFlagLine },
      { t: "Which career suits me?", icon: RiFeedbackLine }
    ],
    responses: { "default": "I'm listening. But let's get specific—are you stuck on technical skills, or is it a matter of mindset and consistency?" }
  },
  hi: {
    intro: "Hey... relax. Koi tension nahi hai.\n\nSach-sach batao — dimaag me kya chal raha hai? Career, confusion, ya kuch aur?",
    input_placeholder: "Seedhi baat karo dost...",
    suggestion_chips: [
       { t: "Main bhatak gaya hoon", icon: RiEmotionLine },
       { t: "Mujhe kya seekhna chahiye?", icon: RiCompassLine },
       { t: "Kya main hire ho jaoonga?", icon: RiFlagLine }
    ],
    responses: { "default": "Main sun raha hoon. Par thoda saaf batao—kya dikkat technical skills me hai ya focus nahi ban paa raha?" }
  }
};

const DICTIONARY = {
  frontend: ['frotnend', 'frntend', 'fronten', 'fronteng', 'fontend', 'frondend', 'ui', 'ux', 'css', 'html', 'react', 'vue', 'angular'],
  backend: ['bakend', 'backnd', 'backen', 'backand', 'bckend', 'backendd', 'node', 'express', 'sql', 'db', 'java', 'cpp', 'c++', 'laravel', 'php', 'golang'],
  fullstack: ['fullstack', 'full-stack', 'full stack', 'fullstak', 'mern', 'mean', 'full stack developer'],
  python: ['pyton', 'pythn', 'paython', 'pithon', 'pythan'],
  javascript: ['js', 'javascrit', 'javascrip', 'javscript', 'jvascript', 'javasript'],
  roadmap: ['rodmap', 'roadmp', 'radmap', 'rodmp'],
  interview: ['intervew', 'intervu', 'intrview', 'interveiw'],
  confusion: ['confuson', 'confusn', 'confujion', 'confujan'],
  career: ['carer', 'carrer', 'creer', 'carear'],
  hello: ['helo', 'hllo', 'hlo', 'hii', 'hiii', 'heyy', 'hey', 'heyya', 'hi'],
  start: ['shuru', 'begin', 'starting', 'startin', 'stats'],
  project: ['proyect', 'proyects', 'projec', 'build', 'idea', 'makesomething', 'new'],
  aiml: ['ai', 'ml', 'machinelearning', 'artificialintelligence', 'deeplearning', 'data', 'ds'],
  mobile: ['flutter', 'reactnative', 'android', 'ios', 'swift', 'kotlin', 'app', 'androidstudio'],
  cloud: ['aws', 'azure', 'devops', 'docker', 'kubernetes', 'cloudcomputing'],
  progression: ['after', 'next', 'then', 'future', 'what should i learn after', 'what next'],
  discovery: ['what should i learn', 'what to learn', 'guide me', 'which path', 'seekhna', 'seekhen', 'study', 'learn']
};

export default function MentorModePage() {
  const [lang, setLang] = useState('en');
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isJudgeMode, setIsJudgeMode] = useState(false);
  const [lastTopic, setLastTopic] = useState(null);
  
  const chatEndRef = useRef(null);
  const currentStrings = MENTOR_AI[lang];

  const JUDGE_QS = [
    { q: "What makes you different?", r: "Most AI tools answer questions. I don’t. I understand WHY you're asking. If you want to be a dev, I don't just give a roadmap—I check your consistency, your passion, and whether you're just chasing trends." },
    { q: "Decision Intelligence?", r: "I combine skill gap analysis, learning behavior, and past consistency with your GitHub signals. If your path leads to failure, I warn you BEFORE you start." },
    { q: "Risk Alert Engine?", r: "A real mentor warns you. When I detect weak fundamentals, I trigger a 'High Risk' alert. This creates urgency so you stop scrolling and start fixing." },
    { q: "Competitive Advantage?", r: "Others show data. We show CONSEQUENCES. We say 'If you don't fix this, you will fail interviews in 3 months'. That emotional trigger changes behavior." }
  ];

  useEffect(() => {
    setChat([{ type: 'mentor', text: currentStrings.intro, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, isTyping]);

  const addMessage = (type, text) => {
    setChat(prev => [...prev, { type, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const detectAndCorrectTypos = (text) => {
    let corrected = text;
    let found = [];
    Object.entries(DICTIONARY).forEach(([correct, typos]) => {
      typos.concat([correct]).forEach(typo => {
        const escaped = typo.replace('+', '\\+').replace('.', '\\.');
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        if (regex.test(text)) {
          corrected = corrected.replace(regex, correct);
          if (!found.includes(correct)) found.push(correct);
        }
      });
    });
    return { corrected, found };
  };

  const handleSend = (textOverride) => {
    const rawMsg = textOverride || input.trim();
    if (!rawMsg) return;

    const { corrected, found } = detectAndCorrectTypos(rawMsg);
    const userMsg = corrected;
    const t = userMsg.toLowerCase();
    
    let detectedLang = lang;
    if (/[\u0900-\u097F]/.test(userMsg)) detectedLang = 'hi';
    if (detectedLang !== lang) setLang(detectedLang);

    addMessage('user', rawMsg);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (found.length > 0 && found[0] !== 'hello') setLastTopic(found[0]);

      const judgeReply = JUDGE_QS.find(j => j.q === userMsg);
      const isHowAreYou = /how\s*(are|r)\s*(you|u)|kaise\s*ho|kya\s*haal|kaisa\s*hai/i.test(t);
      const isBasicHello = /^(hi|hello|hey|helo|hii|heyya)\b/i.test(t) || found.includes('hello');
      const isProgression = found.includes('progression');
      const isDiscovery = found.includes('discovery');

      if (judgeReply) {
        reply = judgeReply.r;
      } else if (isHowAreYou) {
        reply = detectedLang === 'hi' ? "Main ekdum badhiya hoon dost! Tum batao, career me kya naya build karna hai?" : "I'm doing fantastic! Ready to help you build something meaningful today. What's on your mind?";
      } else if (isBasicHello) {
        reply = detectedLang === 'hi' ? "Hello! Kaise ho? Kuch career ke baare me dimaag me chal raha hai?" : "Hello! How are things? What's on your mind regarding your career today?";
      } 
      // 🧭 DISCOVERY LOGIC (Choosing a Path)
      else if (isDiscovery) {
        reply = detectedLang === 'hi' ? "Raasta chunna mushkil kaam hai. Batao, tumhe visual/creative work (Frontend) pasand hai, logical structure (Backend), ya data ki power (AI/ML)?" : "Choosing a path is the hardest part. Tell me, do you enjoy more visual/creative work (Frontend), the logical/hidden structure (Backend), or the predictive power of data (AI/ML)?";
      }
      // 🔮 PROGRESSION LOGIC (What's Next?)
      else if (isProgression && found.includes('frontend')) {
        reply = "After Frontend, don't just stay in the UI. Move into **Backend (Node.js/SQL)** to become Full-Stack, or dive deep into **Performance Engineering**. Most devs stop at React; you should start at Server-Side Rendering (SSR) and Optimization.";
      } else if (isProgression && found.includes('backend')) {
        reply = "Backend mastered? Now move towards **Cloud Architecture (AWS)** and **System Design**. Understanding how to scale a database is what differentiates a Junior from a Senior Engineer.";
      } else if (isProgression && found.includes('aiml')) {
        reply = "If you know basic AI/ML, the next step is **Applied ML (MLOps)**. Deployment and monitoring are much harder than training models. Build a pipeline, not just a notebook.";
      }
      // 🏰 FULLSTACK / INTEGRATED TRACKS
      else if (found.includes('fullstack')) {
        reply = "Full-Stack isn't just knowing two things; it's understanding how they connect. If you don't know how the network layer works or how to optimize a SQL query, you aren't Full-Stack yet. Start by building a real-time, distributed system.";
      }
      // 🏗️ CATEGORY-SPECIFIC INTELLIGENCE
      else if (found.includes('aiml')) {
        reply = "AI/ML attracts followers, but rewards builders. If you aren't ready to handle linear algebra and dirty datasets, you're just using APIs. Start building a predictive engine from scratch if you want to be top 1%.";
      } else if (found.includes('frontend')) {
        reply = "Frontend isn't just centering a div anymore. It's about performance, state management, and accessibility. Build a highly complex dashboard with real-time data if you want to prove you're an Engineer, not just a UI dev.";
      } else if (found.includes('backend')) {
        reply = "Backend is the brain. Stop following tutorials. Build a distributed system or a custom authentication engine from scratch. Real backend engineers handle scale and failures, not just CRUD.";
      } else if (found.includes('mobile')) {
        reply = "Mobile is about the 1-second experience. If your app isn't snappy and offline-first, users will uninstall it. Don't build a clones—build a utility that handles local-first storage and push notifications perfectly.";
      } else if (found.includes('cloud')) {
        reply = "DevOps/Cloud isn't just pointing at a dashboard. It's about Infrastructure as Code (IaC) and automation. If you can't spin up a secure, auto-scaling cluster with a single command, you haven't mastered it yet.";
      } else if (found.includes('project') || found.includes('build')) {
        reply = "Stop building what's easy. Build something that terrifies you. A project isn't a success if you didn't have to refactor it three times. What's the hardest domain you know? Build that.";
      } else if (detectedLang === 'hi') {
        const h = userMsg;
        if (found.length > 0) reply = `Haan, main samajh gaya aap ${found[0]} ke baare me baat kar rahe ho. `;
        if (/\b(shuru|start|kaise|kaha)\b/i.test(h)) reply += "Seedhi baat hai: AI ho ya Web, fundamentals pe dhyan do. Aik time pe aik hi roadmap finish karo.";
        else if (/\b(motivation|mann nahi|boring|focus)\b/i.test(h)) reply += "Motivation temporary hai, discipline permanent. Routine banao aur usse follow karo.";
        else if (/\b(job|hired|naukri|paisa|salary|interviews)\b/i.test(h)) reply += "Skills dikhao, naukri peeche bhagegi. GitHub green hona chahiye, wahi tumhari asli degree hai.";
        else reply = MENTOR_AI.hi.responses.default;
      } else {
        if (found.length > 0) reply = `I see you're interested in ${found[0]}. `;
        if (/\b(too late|age|old)\b/.test(t)) reply += "Age is irrelevant in tech. What matters is skill depth. The only thing that makes it 'too late' is if you stop today.";
        else if (/\b(how.*start|starting|begin)\b/.test(t)) reply += "One thing at a time. Pick ONE path and go deep. Fundamentals get you hired.";
        else if (/\b(motivation|stay focused|scared|fear|confused)\b/.test(t)) reply += "It's normal to feel overwhelmed. Build a routine, not a list of dreams. Discipline settles the mind.";
        else if (/\b(job|hired|interview|company)\b/.test(t)) reply += "Build hard things before you even think of applying. Proving you can solve problems is how you actually get hired.";
        else if (/\b(career|suits|path|specialization)\b/.test(t)) reply += "The best career is the one where you enjoy the struggle. Don't chase trends, chase your own curiosity.";
        else if (/\s*(yes|okay|ok|sure|i will|thanks|thank you)\s*/i.test(t) && lastTopic) {
           reply = `Exactly. Since we were talking about ${lastTopic}, what's your first step going to be today? No excuses.`;
        }
        else reply = MENTOR_AI.en.responses.default;
      }
      
      setIsTyping(false);
      addMessage('mentor', reply);
    }, 1000 + Math.random() * 500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f17] text-white overflow-hidden font-inter relative">
      {/* 🏙️ HEADER */}
      <div className="flex-shrink-0 h-16 lg:h-20 flex items-center justify-between px-4 lg:px-10 border-b border-white/5 z-20 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
           <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg lg:rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <RiPsychotherapyLine className="text-lg lg:text-2xl" />
           </div>
           <div className="min-w-0">
              <h1 className="text-sm lg:text-lg font-black text-white italic tracking-tighter truncate uppercase leading-none">Aman <span className="hidden sm:inline text-purple-400 not-italic font-sans text-[10px] border border-purple-500/20 px-2 py-0.5 rounded-full ml-2 uppercase">MENTOR PROTOCOL</span></h1>
              <p className="text-[8px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">Status: Active Intelligence Access</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsJudgeMode(!isJudgeMode)} 
             className={`flex items-center gap-2 px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-xl text-[9px] lg:text-[10px] font-black uppercase transition-all border ${isJudgeMode ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
           >
             <RiSparklingFill className={isJudgeMode ? 'animate-pulse' : ''} />
             <span className="hidden xs:inline">{isJudgeMode ? 'Judge Mode' : 'Demo Mode'}</span>
           </button>
           <div className="w-px h-5 bg-white/10 mx-1 lg:mx-2 hidden sm:block" />
           <div className="flex bg-slate-900 rounded-lg p-1">
             {['en', 'hi'].map(l => (
               <button key={l} onClick={() => setLang(l)} className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${lang === l ? 'bg-white text-slate-950' : 'text-slate-500 hover:text-white'}`}>
                 <span className="text-[10px] font-black uppercase">{l}</span>
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* 🚀 CHAT INTERFACE */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-10 py-6 lg:py-10 space-y-8 lg:space-y-12 custom-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] lg:max-w-[70%] flex flex-col gap-2 group`}>
                  <div className={`px-5 py-4 lg:px-8 lg:py-6 rounded-2xl lg:rounded-[2.5rem] text-sm lg:text-base leading-relaxed font-medium transition-all shadow-xl ${m.type === 'user' ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-none' : 'bg-[#151d2a] text-slate-100 border border-white/5 rounded-tl-none'}`}>
                    <p className="whitespace-pre-line tracking-tight">{m.text}</p>
                    <div className="text-[8px] lg:text-[9px] mt-4 font-black opacity-30 flex items-center justify-end gap-1 uppercase tracking-widest">
                      {m.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex justify-start pl-2 lg:pl-0">
                  <div className="bg-[#151d2a] px-6 py-4 rounded-full flex gap-2 items-center border border-white/5 shadow-2xl">
                     <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                     <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                  </div>
               </div>
            )}
            <div ref={chatEndRef} />
        </div>
      </div>

      {/* 💬 INTERACTION LAYER */}
      <div className="flex-shrink-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 pt-4 lg:pt-6 pb-8 lg:pb-10">
          <div className="px-4 lg:px-10 mb-4 lg:mb-6 flex overflow-x-auto custom-scrollbar no-scrollbar gap-2 lg:gap-3 lg:justify-center pb-2">
             {(isJudgeMode ? JUDGE_QS.map(j => ({ t: j.q, icon: RiSparklingFill })) : currentStrings.suggestion_chips).map((chip, ci) => (
                <button key={ci} onClick={() => handleSend(chip.t)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-2.5 rounded-full text-[10px] lg:text-[11px] font-black uppercase tracking-widest transition-all border whitespace-nowrap active:scale-95 ${isJudgeMode ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                    <chip.icon className="text-xs" /> {chip.t}
                </button>
             ))}
          </div>

          <div className="px-4 lg:px-10 flex justify-center">
            <div className="w-full max-w-4xl flex items-center gap-3 lg:gap-4 relative group">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder={currentStrings.input_placeholder}
                className="w-full bg-slate-900/80 text-white border border-white/10 rounded-2xl lg:rounded-full px-5 py-4 lg:px-10 lg:py-6 text-sm lg:text-base font-medium focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-600 shadow-2xl group-hover:border-white/20"
              />
              <button 
                onClick={() => handleSend()} 
                disabled={!input.trim() || isTyping} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-3 lg:p-4 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-xl lg:rounded-full hover:scale-105 active:scale-95 disabled:opacity-40 transition-all shadow-xl shadow-purple-900/20"
              >
                 <RiSendPlaneFill className="text-xl lg:text-2xl" />
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}

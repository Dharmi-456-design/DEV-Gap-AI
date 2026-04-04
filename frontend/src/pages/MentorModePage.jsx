import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  RiSendPlaneLine, RiBrainLine, RiAlertLine, RiCheckboxCircleLine,
  RiFireLine, RiTimeLine, RiShieldLine, RiArrowRightLine, RiRefreshLine,
  RiCloseLine, RiRocketLine, RiErrorWarningLine, RiPsychotherapyLine,
  RiBarChartLine, RiMedalLine, RiThunderstormsLine, RiStarLine,
  RiHeartLine, RiEmotionHappyLine, RiEmotionUnhappyLine, RiEmotionLine,
  RiFileTextLine
} from 'react-icons/ri';

// ── QUESTIONS ─────────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id: 'career_goal',    field: 'careerGoal',       type: 'text',     mentor: "Let's cut to the chase. What career path are you chasing right now? Be specific.", placeholder: 'e.g. AI/ML Engineer, Full Stack Dev, Data Scientist…' },
  { id: 'motivation',     field: 'motivation',        type: 'textarea', mentor: "WHY do you want this? The REAL reason — not 'it pays well'. Dig deep.", placeholder: 'e.g. I love solving problems, I want to build things that matter…' },
  { id: 'current_skill',  field: 'currentSkills',     type: 'textarea', mentor: "What have you actually BUILT? Not courses. Not tutorials. Real projects.", placeholder: 'e.g. Todo app in React, REST API with Node, Python data scraper…' },
  { id: 'study_hours',    field: 'studyHours',        type: 'text',     mentor: "How many hours do you ACTUALLY code every day? Not what you plan — what you DO.", placeholder: 'e.g. 1 hour, 3 hours, honestly 30 minutes…' },
  { id: 'consistency',    field: 'consistency',       type: 'choice',   mentor: "Are you consistent, or do you study 3 days then vanish for a week?",
    options: [
      { label: '🔥 Consistent — show up every single day', value: 'high' },
      { label: '⚡ Mostly consistent — miss a few days', value: 'medium' },
      { label: '😅 Motivated sometimes — start and stop', value: 'low' },
      { label: '💀 Barely — more planning than doing', value: 'none' },
    ]},
  { id: 'experience',     field: 'experienceLevel',   type: 'choice',   mentor: "What is your current experience level in this field?",
    options: [
      { label: '🌱 Complete Beginner', value: 'beginner' },
      { label: '📘 Basic — done tutorials', value: 'basic' },
      { label: '⚙️ Intermediate — built real things', value: 'intermediate' },
      { label: '🚀 Advanced — professional level', value: 'advanced' },
    ]},
  { id: 'weakness',       field: 'biggestWeakness',   type: 'textarea', mentor: "Last one. What is your BIGGEST weakness right now? Be brutally honest.", placeholder: 'e.g. I procrastinate, don\'t finish projects, no consistency…' },
];

// ── EMOTION DETECTION ─────────────────────────────────────────────────────────
function detectEmotion(text) {
  const t = text.toLowerCase();
  if (/\b(quit|give up|giving up|done|tired of|fed up|can't do|over it)\b/.test(t)) return 'burnout';
  if (/\b(scared|afraid|fear|anxious|anxiety|nervous|worried|worry)\b/.test(t)) return 'scared';
  if (/\b(hopeless|useless|worthless|stupid|dumb|not smart|failure|loser|nobody)\b/.test(t)) return 'hopeless';
  if (/\b(frustrated|frustrating|angry|annoyed|upset|rage|mad)\b/.test(t)) return 'frustrated';
  if (/\b(confused|lost|no idea|don't know|which one|what should|idk|help me)\b/.test(t)) return 'confused';
  if (/\b(too late|behind|everyone else|already|late start|old|age)\b/.test(t)) return 'toolate';
  if (/\b(excited|motivated|ready|let's go|pumped|fired up|can't wait)\b/.test(t)) return 'excited';
  if (/\b(demotivated|unmotivated|motivation|not motivated|lazy|no energy)\b/.test(t)) return 'demotivated';
  if (/\b(overwhelmed|too much|so much|overloaded|everything at once)\b/.test(t)) return 'overwhelmed';
  if (/\b(comparison|compare|everyone is|they are better|behind others)\b/.test(t)) return 'comparison';
  return 'neutral';
}

// ── EMOTIONAL ACKNOWLEDGEMENT ─────────────────────────────────────────────────
function emotionalAck(emotion) {
  const acks = {
    burnout:     "I hear you — you're exhausted and questioning everything. That's real, and it matters. But burning out doesn't mean you're wrong, it means you've been running without a plan.",
    scared:      "That fear you're feeling? It means this actually matters to you. Fear and readiness often look identical. Let's separate them.",
    hopeless:    "I'm not going to dismiss that feeling. But I need you to know — hopelessness is a temporary state, not a permanent truth. You reached out. That alone says something.",
    frustrated:  "Your frustration makes sense. It usually means you're trying hard and not seeing results yet. That gap between effort and outcome — we'll fix that.",
    confused:    "Confusion is actually a good sign. It means you're thinking, not just following blindly. Let me cut through the noise for you.",
    toolate:     "Stop. It is never too late. The only timeline that matters is yours — not LinkedIn influencers, not your peers, not society. Yours.",
    excited:     "That energy is your strongest asset right now. Let's make sure it's pointed in the right direction.",
    demotivated: "Motivation comes and goes. That's normal. What you need is a system that works even on days when motivation is zero. Let's build that.",
    overwhelmed: "You don't have to learn everything. You need to learn the right things in the right order. Let me simplify this.",
    comparison:  "Comparing yourself to others is the fastest way to destroy your own progress. Everyone's timeline is different. Focus on YOUR next step.",
    neutral:     null,
  };
  return acks[emotion] || null;
}

// ── FREE CHAT RESPONSE ENGINE ─────────────────────────────────────────────────
function getMentorChatReply(userMsg, context) {
  const t = userMsg.toLowerCase();
  const emotion = detectEmotion(userMsg);
  const ack = emotionalAck(emotion);
  const goal = context?.careerGoal || 'your goal';
  const score = context?.humanReadinessScore || 50;

  let reply = '';

  // Attach emotional acknowledgement first
  if (ack) reply = ack + '\n\n';

  // Question matching
  if (/\b(too late|late start|age|old)\b/.test(t)) {
    reply += `Age is irrelevant in tech. The seniors I've seen hired were 35, 40, 45+. What matters is skill depth and how you communicate it. The only thing that makes it "too late" is if you stop today.`;
  } else if (/\b(how.*start|where.*start|begin|first step|starting)\b/.test(t)) {
    reply += `One thing at a time. Don't open 10 courses. Pick ONE path and go deep on it for 30 days. For ${goal}, start with the fundamentals — not the cool stuff. The fundamentals are what get you hired.`;
  } else if (/\b(motivation|motivated|keep going|stay focused)\b/.test(t)) {
    reply += `Motivation is unreliable. It shows up uninvited and leaves without warning. Build a routine instead. Same time, same chair, same goal every day. Discipline is the upgrade from motivation.`;
  } else if (/\b(roadmap|what.*learn|which.*course|curriculum|path)\b/.test(t)) {
    reply += `For ${goal}: roadmap.sh is your bible. Pick the exact role, follow it strictly. No detours. Stop starting new courses every week — finish one thing completely before the next.`;
  } else if (/\b(job|hired|interview|placement|employment|company)\b/.test(t)) {
    reply += `You don't get hired by having a perfect resume. You get hired by having projects that prove you can solve real problems. Before sending a single application, build 2 deployable projects relevant to ${goal}. Then apply.`;
  } else if (/\b(project|build|portfolio|github)\b/.test(t)) {
    reply += `Build something you'd actually use. Don't build another todo app. Think: what problem do YOU have that technology could solve? Build that. It will be 10x more impressive because your passion will show.`;
  } else if (/\b(quit|give up|stop|done with|leaving)\b/.test(t)) {
    reply += `Don't mistake a hard week for a wrong path. Every person in tech has had a moment where they wanted to walk away. The ones who stayed are the ones who made it. Rest if you need to — but don't quit.`;
  } else if (/\b(compare|others|everyone|peers|friends|classmate)\b/.test(t)) {
    reply += `Close Instagram. Close LinkedIn. Other people's highlights are not their full story. Someone posting about their internship at Google probably failed 50 interviews before it. Focus on YOUR code, YOUR growth.`;
  } else if (/\b(salary|money|pay|income|earning)\b/.test(t)) {
    reply += `Money follows skill. A junior developer with 1 year of real project experience earns more than someone with 3 years of certificates. Stop thinking about salary and start thinking about skill depth. The money will come.`;
  } else if (/\b(degree|college|university|qualification|diploma)\b/.test(t)) {
    reply += `In 2025+, companies care about what you can DO, not where you studied. Your GitHub is your degree. I've seen people hired at top firms with no degree and a strong portfolio. Build the portfolio.`;
  } else if (/\b(how long|time|months|years|when.*ready)\b/.test(t)) {
    reply += `With ${score >= 65 ? 'your current effort level' : 'more discipline than you currently have'}, a realistic timeline to job-readiness in ${goal} is ${score >= 65 ? '6–9 months' : '12–18 months'}. But that's IF you study consistently every day. Not occasionally.`;
  } else if (/\b(certificate|certification|course|udemy|coursera)\b/.test(t)) {
    reply += `Certifications supplement skills — they don't create them. No certificate will get you hired. Projects will. Take a course to learn; build a project to prove it. In that order, always.`;
  } else if (/\b(thank|thanks|helpful|great|amazing|good advice)\b/.test(t)) {
    reply += `Good. Now stop reading and start building. Every minute you spend talking about learning is a minute you're not actually learning. Go. Open your editor.`;
  } else if (/\b(why|purpose|meaning|point)\b/.test(t)) {
    reply += `Purpose comes from doing, not thinking. You won't find your "why" sitting here wondering about it. Start building something. Action creates clarity. Clarity doesn't create action.`;
  } else if (/\b(help|advice|guide|mentor|suggest)\b/.test(t)) {
    reply += `Tell me specifically what you're struggling with. "I need help" is too broad. The more specific your question, the more useful my answer. What exact thing are you stuck on right now?`;
  } else if (/\b(self doubt|not good enough|can i|capable|can't)\b/.test(t)) {
    reply += `Everyone — and I mean EVERYONE — who codes feels this. It's called impostor syndrome and it never fully goes away. The difference is that experienced developers have learned to work through it instead of being stopped by it. So keep working.`;
  } else {
    // Generic but still human-like
    const generics = [
      `Here's what I know about your situation: a score of ${score}/100 tells me you have ${score >= 65 ? 'serious potential' : 'real gaps to close'}. Whatever you're asking — the answer always comes back to consistent action. What specifically are you trying to figure out?`,
      `I'll be straight with you. Most career problems come from one of three things: no clear direction, no consistent effort, or no real projects. Which of those three is closest to your real issue right now?`,
      `That's a valid thing to think about. But instead of getting more information, what's the ONE action you could take in the next 24 hours? Start there.`,
    ];
    reply += generics[Math.floor(Math.random() * generics.length)];
  }

  return reply;
}

// ── ASSESSMENT ENGINE ─────────────────────────────────────────────────────────
function analyzeUser(answers) {
  const { careerGoal, studyHours, consistency, experienceLevel, currentSkills, biggestWeakness } = answers;
  const goal = (careerGoal || '').toLowerCase();
  const h = parseFloat(studyHours) || 0;
  const isAI = /ai|ml|machine learning|data sci/.test(goal);
  const isFS = /full.?stack|web dev/.test(goal);
  const isDevOps = /devops|cloud|aws/.test(goal);

  const effortScore = h>=6?100:h>=4?80:h>=2?55:h>=1?30:10;
  const consistencyScore = {high:100,medium:70,low:35,none:10}[consistency]||20;
  const projectScore = currentSkills?.split(',').length>=3?80:currentSkills?.length>80?60:currentSkills?.length>30?35:10;
  const expScore = {beginner:10,basic:30,intermediate:65,advanced:90}[experienceLevel]||10;
  const wk = (biggestWeakness||'').toLowerCase();
  let disc = 70;
  if (/procrastin/.test(wk)) disc-=25;
  if (/don't finish|not finish/.test(wk)) disc-=20;
  if (/distract/.test(wk)) disc-=15;
  if (/consistent|lazy/.test(wk)) disc-=20;
  if (disc<10) disc=10;

  const humanReadinessScore = Math.round(effortScore*.25+consistencyScore*.25+projectScore*.20+expScore*.15+30*.10+disc*.05);

  const contradictions = [];
  if (isAI&&h<3) contradictions.push({conflict:`You want AI Engineering but only study ${h||'<1'} hr/day.`,reality:'AI/ML needs deep math, Python, and models. Minimum 3 hrs/day consistently.'});
  if (consistency==='low'||consistency==='none') contradictions.push({conflict:'You admitted you are not consistent.',reality:'Inconsistency is the #1 career killer. No shortcut around it.'});
  if (experienceLevel==='beginner'&&(isAI||isDevOps)) contradictions.push({conflict:`Beginner aiming straight for ${isAI?'AI':'DevOps'}.`,reality:'Solid foundations first. Skipping them causes burnout and imposter syndrome.'});
  if (h<1&&projectScore<40) contradictions.push({conflict:'Low hours + minimal projects.',reality:'You are building neither theory nor practical skills. This leads to stagnation.'});

  let verdict='REALISTIC',verdictColor='emerald',verdictEmoji='✅';
  if (humanReadinessScore<40||contradictions.length>=2){verdict='NOT REALISTIC RIGHT NOW';verdictColor='red';verdictEmoji='🚫';}
  else if (humanReadinessScore<65||contradictions.length>=1){verdict='POSSIBLE BUT DIFFICULT';verdictColor='amber';verdictEmoji='⚠️';}

  let betterPath=null,betterReason=null;
  if (verdict!=='REALISTIC') {
    if (isAI&&experienceLevel==='beginner'){betterPath='Backend Developer';betterReason='Faster curve, same building blocks as AI. Step here first.';}
    else if (isFS&&experienceLevel==='beginner'){betterPath='Frontend Developer';betterReason='Full stack = 2 careers. Start Frontend, get hired, then add backend.';}
    else if (isDevOps&&(experienceLevel==='beginner'||experienceLevel==='basic')){betterPath='Backend Junior → DevOps';betterReason='DevOps needs system knowledge. Build backend skills first.';}
    else{betterPath='Build 2 Real Projects First';betterReason='Prove consistency with projects before committing to a path.';}
  }

  const actions=[];
  const st=h<2?3:h<3?4:Math.max(h,3);
  actions.push(`Study ${st}+ focused hours EVERY day — no exceptions.`);
  if(projectScore<60)actions.push('Build 2 real deployable projects before applying anywhere.');
  if(consistency!=='high')actions.push('Track daily progress with GitHub commits — public accountability.');
  if(/procrastin|distract/.test(wk))actions.push('Use Pomodoro: 25 min deep work, 5 min break. Phone away.');
  actions.push("Join a community — Discord/Reddit/meetups. Don't code alone.");
  if(isAI||isFS||isDevOps)actions.push('Follow roadmap.sh strictly. No random YouTube rabbit holes.');

  return { humanReadinessScore, verdict, verdictColor, verdictEmoji, effortScore, consistencyScore, projectScore, disciplineScore:disc, contradictions, betterPath, betterReason, actions, careerGoal:careerGoal||'Unknown', experienceLevel:experienceLevel||'unknown' };
}

// ── INPUT VALIDATOR ──────────────────────────────────────────────────────────
function isGibberish(text) {
  if (!text || text.trim().length < 2) return true;
  const clean = text.trim().replace(/[^a-zA-Z]/g, '');
  if (clean.length === 0) return false; // numbers/symbols — handle separately
  const vowels = (clean.match(/[aeiouAEIOU]/g) || []).length;
  const ratio = vowels / clean.length;
  // Less than 15% vowels in a text longer than 4 chars = gibberish
  if (clean.length > 4 && ratio < 0.15) return true;
  // Check for repeating same character pattern like "aaaa" or "rgrgrbjr"
  if (/^([a-z]{1,3})\1{2,}$/i.test(clean)) return true;
  // No spaces and all consonants > 7 chars = gibberish
  if (!text.includes(' ') && clean.length > 7 && ratio < 0.2) return true;
  return false;
}

function validateAnswer(qId, answer) {
  const trimmed = (answer || '').trim();

  if (!trimmed) return { valid: false, msg: "You didn't write anything. I need a real answer." };

  if (qId === 'career_goal') {
    if (trimmed.length < 4) return { valid: false, msg: "That's too short. Tell me your actual career goal — like 'Full Stack Developer' or 'Data Scientist'." };
    if (isGibberish(trimmed)) return { valid: false, msg: "That's not a real career path. I need an actual answer — like 'AI Engineer', 'Backend Developer', or 'UI/UX Designer'. Try again." };
    // Must resemble a real career (contain at least one real word-like token)
    const hasWord = trimmed.split(/\s+/).some(w => w.length >= 3 && /[aeiou]/i.test(w));
    if (!hasWord) return { valid: false, msg: "I don't recognize that as a real career path. Be specific — name an actual role you want." };
  }

  if (qId === 'motivation') {
    if (trimmed.length < 15) return { valid: false, msg: "That's not a real answer. Tell me WHY you actually want this career. Give me at least a sentence." };
    if (isGibberish(trimmed)) return { valid: false, msg: "That doesn't make sense. Write your real motivation — why does this career matter to you?" };
  }

  if (qId === 'current_skill') {
    if (trimmed.length < 5) return { valid: false, msg: "You gave me nothing. Tell me what you've actually built — even a simple project counts. Be honest." };
    if (isGibberish(trimmed)) return { valid: false, msg: "That's not a real answer. List actual projects or technologies you've worked with." };
  }

  if (qId === 'study_hours') {
    // Must be numeric or contain a number
    const hasNumber = /\d/.test(trimmed) || /half|hour|minute|none|zero|rarely|sometimes/i.test(trimmed);
    if (!hasNumber) return { valid: false, msg: "I need a number. How many hours do you actually study per day? Write something like '1 hour', '2', or '30 minutes'." };
    if (isGibberish(trimmed) && !/\d/.test(trimmed)) return { valid: false, msg: "That's not a valid answer. Just tell me the number of hours — like '1', '2', '3'." };
  }

  if (qId === 'weakness') {
    if (trimmed.length < 8) return { valid: false, msg: "That's not a real weakness. Give me something genuine — procrastination, lack of consistency, fear of failure. Be honest." };
    if (isGibberish(trimmed)) return { valid: false, msg: "I can't understand that. Write your actual weakness in plain words." };
  }

  return { valid: true };
}

// ── MENTOR QUICK RESPONSE (during assessment) ─────────────────────────────────
function quickMentorReply(qId, answer, consistency) {
  const emo = detectEmotion(typeof answer==='string'?answer:'');
  const ack = emotionalAck(emo);
  const prefix = ack ? ack.split('.')[0] + '. ' : '';
  const h = parseFloat(answer)||0;
  switch(qId){
    case 'career_goal': return answer.length<5?'That\'s not an answer. Be specific.':prefix+`${answer} — bold choice. Let's see if your actions match.`;
    case 'motivation': return /money|salary|pay/.test(answer.toLowerCase())?prefix+'Money follows skill, not intention. Noted.':answer.length>60?prefix+"That's real. But words are cheap — actions decide everything.":'Vague. Your actions will reveal the truth.';
    case 'current_skill': return answer.length<30?prefix+'Barely anything. At least you\'re being honest — most people aren\'t.':prefix+'Some work. Enough? We\'ll find out.';
    case 'study_hours': return h>=5?prefix+'Rare dedication. Consistency matters more than raw hours though.':h>=3?prefix+'Decent. If real and daily, we can work with it.':h>=1?prefix+'One to two hours. Not enough for a serious technical career.':prefix+'Less than an hour. Brace yourself for a hard truth.';
    case 'consistency': return consistency==='high'?prefix+'Good. Consistency is the real skill most people are missing.':consistency==='medium'?prefix+'"Sometimes" isn\'t good enough in a competitive market.':prefix+'This is your biggest obstacle. Not your skills. Your consistency.';
    case 'experience': return prefix+'Noted. Your level determines how brutal my assessment will be.';
    case 'weakness': return answer.length>30?prefix+'Good — self-awareness is rare. Now the data speaks.':prefix+'That\'s all? The numbers will tell the rest.';
    default: return 'Noted.';
  }
}

// ── SUB COMPONENTS ────────────────────────────────────────────────────────────
function ScoreBar({label,value,color}){
  const c={gold:'from-primary-500 to-secondary-500',red:'from-red-500 to-rose-600',emerald:'from-emerald-500 to-teal-500',blue:'from-blue-500 to-cyan-500',purple:'from-purple-500 to-pink-500',amber:'from-amber-400 to-secondary-500'};
  return(<div><div className="flex justify-between text-xs mb-1.5"><span className="text-slate-500">{label}</span><span className="text-white font-bold">{value}/100</span></div><div className="h-2 bg-slate-900/40/10 rounded-full overflow-hidden"><div style={{width:`${value}%`,transition:'width 1.2s ease-out'}} className={`h-full bg-gradient-to-r ${c[color]||c.gold} rounded-full`}/></div></div>);
}

function ReadinessRing({score}){
  const r=54,circ=2*Math.PI*r,offset=circ-(score/100)*circ;
  const col=score>=70?'#10b981':score>=45?'#f59e0b':'#ef4444';
  return(<div className="relative flex items-center justify-center"style={{width:140,height:140}}><svg width={140}height={140}className="-rotate-90"><circle cx={70}cy={70}r={r}fill="none"stroke="#1a1a26"strokeWidth={10}/><circle cx={70}cy={70}r={r}fill="none"stroke={col}strokeWidth={10}strokeDasharray={circ}strokeDashoffset={offset}strokeLinecap="round"style={{transition:'stroke-dashoffset 1.5s ease-out'}}/></svg><div className="absolute text-center"><p className="text-3xl font-black"style={{color:col}}>{score}</p><p className="text-xs text-slate-500">/ 100</p></div></div>);
}

function MentorBubble({text,animate,emotion}){
  const emotionIcon = {burnout:'🫂',scared:'💙',hopeless:'🤝',frustrated:'💪',confused:'🧭',toolate:'⏰',excited:'🚀',demotivated:'⚡',overwhelmed:'🌊',comparison:'🎯',neutral:null}[emotion||'neutral'];
  return(
    <div className={`flex items-start gap-3 ${animate?'slide-in-left':''}`}>
      <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
        <RiPsychotherapyLine className="text-white text-base"/>
      </div>
      <div className="max-w-xl flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs text-purple-400 font-bold">MENTOR</p>
          {emotionIcon&&<span className="text-xs">{emotionIcon}</span>}
        </div>
        <div className="bg-slate-900/40/5 border border-purple-500/20 rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-white text-sm leading-relaxed whitespace-pre-line">{text}</p>
        </div>
      </div>
    </div>
  );
}

function UserBubble({text}){
  return(
    <div className="flex items-start gap-3 flex-row-reverse slide-in-right">
      <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
        <RiEmotionLine className="text-white text-base"/>
      </div>
      <div className="max-w-xl">
        <p className="text-xs text-primary-400 font-bold mb-1 text-right">YOU</p>
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-white text-sm leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

function TypingBubble(){
  return(
    <div className="flex items-center gap-3 slide-in-left">
      <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
        <RiPsychotherapyLine className="text-white text-base"/>
      </div>
      <div className="bg-slate-900/40/5 border border-purple-500/20 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center">
          {[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"style={{animationDelay:`${i*0.15}s`}}/>)}
          <span className="text-xs text-slate-400 ml-2">Mentor is thinking…</span>
        </div>
      </div>
    </div>
  );
}

function AccountabilityTracker({actions}){
  const [checked,setChecked]=useState({});
  const [streak,setStreak]=useState(()=>{try{return parseInt(localStorage.getItem('mentor_streak')||'0');}catch{return 0;}});
  const [lastDate,setLastDate]=useState(()=>{try{return localStorage.getItem('mentor_last_date')||'';}catch{return '';}});
  const todayStr=new Date().toDateString();
  const isToday=lastDate===todayStr;
  const toggle=i=>setChecked(p=>({...p,[i]:!p[i]}));
  const doneCount=Object.values(checked).filter(Boolean).length;
  const handleLog=()=>{if(!isToday){const n=streak+1;setStreak(n);setLastDate(todayStr);try{localStorage.setItem('mentor_streak',String(n));localStorage.setItem('mentor_last_date',todayStr);}catch{}}};
  return(
    <div className="neon-glass-card p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3"><div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"><RiTimeLine className="text-white text-base"/></div><div><h3 className="font-bold text-white">Daily Accountability</h3><p className="text-xs text-slate-400">Your mentor is watching 👀</p></div></div>
        <div className="text-center"><p className="text-2xl font-black text-secondary-400">{streak}</p><p className="text-xs text-slate-400">Day Streak 🔥</p></div>
      </div>
      <div className="space-y-2 mb-4">{actions.map((a,i)=>(<button key={i}onClick={()=>toggle(i)}className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${checked[i]?'bg-emerald-500/10 border-emerald-500/30':'bg-slate-900/40/5 border-white/5 hover:border-white/10'}`}><div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${checked[i]?'bg-emerald-500 border-emerald-500':'border-slate-600'}`}>{checked[i]&&<RiCheckboxCircleLine className="text-white text-xs"/>}</div><span className={`text-sm ${checked[i]?'text-emerald-400 line-through opacity-70':'text-slate-300'}`}>{a}</span></button>))}</div>
      <div className="mb-4"><div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Today's Progress</span><span className="text-primary-400 font-bold">{doneCount}/{actions.length}</span></div><div className="h-2 bg-slate-900/40/10 rounded-full overflow-hidden"><div style={{width:`${(doneCount/actions.length)*100}%`}}className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"/></div></div>
      <button onClick={handleLog}disabled={isToday}className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${isToday?'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default':'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg'}`}>{isToday?`✅ Logged today — ${streak} day streak`:"🔥 Log Today's Session"}</button>
    </div>
  );
}

// ── FREE CHAT PANEL ───────────────────────────────────────────────────────────
function FreeChatPanel({context}){
  const [msgs,setMsgs]=useState([
    {type:'mentor',text:"Your assessment is complete. Now ask me ANYTHING — career doubts, fears, which path to take, how to stay motivated, whether it's too late… I'm here. No question is stupid.",emotion:'neutral'},
  ]);
  const [input,setInput]=useState('');
  const [typing,setTyping]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[msgs,typing]);

  const send=()=>{
    const trimmed=input.trim();
    if(!trimmed)return;
    const emotion=detectEmotion(trimmed);
    setMsgs(p=>[...p,{type:'user',text:trimmed}]);
    setInput('');
    setTyping(true);
    setTimeout(()=>{
      const reply=getMentorChatReply(trimmed,context);
      setMsgs(p=>[...p,{type:'mentor',text:reply,emotion}]);
      setTyping(false);
    },1000+Math.random()*800);
  };

  const handleKey=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}};

  const quickQs=[
    'Am I too late to start this?','How do I stay motivated?','What should I learn first?','Should I quit and switch careers?','Why do I keep procrastinating?','How long will it take to get a job?'
  ];

  return(
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {msgs.map((m,i)=>m.type==='mentor'?<MentorBubble key={i}text={m.text}animate={i===msgs.length-1}emotion={m.emotion}/>:<UserBubble key={i}text={m.text}/>)}
        {typing&&<TypingBubble/>}
        <div ref={endRef}/>
      </div>

      {/* Quick questions */}
      {msgs.length<3&&(
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-400 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQs.map(q=>(
              <button key={q}onClick={()=>{setInput(q);setTimeout(()=>send(),50);}}
                className="text-xs px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 hover:bg-purple-500/20 transition-all">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-white/5 bg-slate-900/40">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}onChange={e=>setInput(e.target.value)}onKeyDown={handleKey}
            placeholder="Ask anything — career, doubts, fears, motivation…"
            rows={2}
            className="flex-1 bg-slate-900/40/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all duration-200 resize-none text-sm"
          />
          <button onClick={send}disabled={!input.trim()}
            className="w-11 h-11 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center disabled:opacity-40 hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg">
            <RiSendPlaneLine className="text-white text-base"/>
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1.5 px-1">Enter to send · Shift+Enter for new line · Ask unlimited questions</p>
      </div>
    </div>
  );
}

// ── RESUME FIX CHAT RESPONSES ─────────────────────────────────────────────────
function getResumeChatReply(userMsg) {
  const t = userMsg.toLowerCase();
  if (/summar|about me|objective|profile/i.test(t))
    return `Your summary should be 2–4 lines max. State your role, top 2–3 skills, and your goal. Example:\n\n"Frontend Developer skilled in React and Tailwind CSS. Passionate about building user-friendly interfaces. Seeking my first professional role to apply and grow my skills."`;
  if (/project|github|portfolio/i.test(t))
    return `Projects are the #1 thing hiring managers look at for junior devs. Each project needs:\n1. Name + 1-line description of what it DOES\n2. The tech stack you used\n3. A live link + GitHub repo link\n\nDon't just list project names — show what problem it solves.`;
  if (/skill|technology|tech stack/i.test(t))
    return `Divide your skills into clear categories:\n\n• Technical: HTML, CSS, JavaScript, React, etc.\n• Tools: Git, VS Code, Figma\n• Optional: Firebase, REST APIs\n\nDon't write more than 10–12 skills. Quality over quantity. Only list things you can actually talk about in an interview.`;
  if (/experience|internship|job/i.test(t))
    return `No experience? That's fine. Replace this section with a stronger Projects section. Real projects you've built are MORE impressive than fake internship titles.\n\nIf you do have experience, format it as:\n• Role @ Company (Month Year – Month Year)\n• What you built/did (use action words: Built, Developed, Maintained)\n• 1–2 bullet points max per role.`;
  if (/certif|course|udemy|coursera/i.test(t))
    return `Certifications are nice but not a substitute for projects. Add them in a separate section at the bottom.\n\nOnly include certificates from recognized platforms: HackerRank, Coursera, Meta, Google, or AWS. Udemy certificates are optional.`;
  if (/education|college|degree/i.test(t))
    return `For education, just list:\n• Degree → College Name → Year\n\nExample: B.Tech Computer Science → XYZ University → 2025\n\nKeep it short. Your projects speak louder than your college name.`;
  if (/format|design|template|look|layout|color/i.test(t))
    return `Resume design rules:\n✅ 1-page max\n✅ Clean, minimal layout\n✅ ATS-friendly fonts (Arial, Calibri, Times New Roman)\n✅ Black and white or very subtle colors\n❌ No photos, no icons everywhere, no fancy graphics — ATS systems can't read them.`;
  if (/ats|applicant|tracking/i.test(t))
    return `ATS (Applicant Tracking System) is a bot that scans your resume before a human sees it.\n\nTo pass ATS:\n• Use standard section headings (Skills, Experience, Education)\n• Include keywords from the job description\n• Avoid tables, columns, images\n• Save as PDF unless told otherwise`;
  if (/length|long|page|short/i.test(t))
    return `Keep it 1 page. No exceptions for under 3 years of experience.\n\nRecruiters spend 6 seconds per resume. Every extra line is a risk. Cut anything that doesn't directly prove your value.`;
  if (/tip|advice|help|improve|fix|better/i.test(t))
    return `Top 5 resume fixes:\n\n1. Add live links to every project\n2. Remove generic buzzwords (hardworking, passionate, team player)\n3. Use action verbs: Built, Developed, Designed, Optimized\n4. Add GitHub link in the header\n5. Quantify anything you can — "Improved load time by 40%" beats "Made website faster"\n\nWhat specific section do you want help with?`;
  return `Good question. Tell me which section of your resume you're working on and I'll give you specific guidance.\n\nFor example, ask me about:\n• Summary / About Me\n• Skills section\n• Projects\n• Experience\n• Education\n• Resume format/design`;
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function MentorModePage(){
  const [searchParams] = useSearchParams();
  const isFixResume = searchParams.get('action') === 'fix_resume';

  const [phase,setPhase]=useState(() => isFixResume ? 'resume_fix' : 'intro');
  const [chatLog,setChatLog]=useState(() => isFixResume ? [
    {type:'mentor', emotion:'neutral', text:
      `I can see you want help fixing your resume. I'm your dedicated Resume Mentor — let's make it interview-ready.\n\nHere's what we'll cover:\n  📋 Header & Contact Info\n  ✍️ Professional Summary\n  💡 Skills section (properly categorized)\n  🔥 Projects (the most important section)\n  🎓 Education & Certifications\n  🎨 Format & ATS optimization\n\nWhat section do you want to fix first? Or ask me anything about your resume.`
    }
  ] : []);
  const [currentQ,setCurrentQ]=useState(0);
  const [inputVal,setInputVal]=useState('');
  const [resumeInput,setResumeInput]=useState('');
  const [answers,setAnswers]=useState({});
  const [analysis,setAnalysis]=useState(null);
  const [isTyping,setIsTyping]=useState(false);
  const [userInsists,setUserInsists]=useState(false);
  const [activeTab,setActiveTab]=useState('result');
  const chatEndRef=useRef(null);

  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:'smooth'});},[chatLog,isTyping,phase]);

  const sendResumeMsg=()=>{
    const trimmed=resumeInput.trim();
    if(!trimmed)return;
    setChatLog(p=>[...p,{type:'user',text:trimmed}]);
    setResumeInput('');
    setIsTyping(true);
    setTimeout(()=>{
      const reply=getResumeChatReply(trimmed);
      setChatLog(p=>[...p,{type:'mentor',text:reply,emotion:'neutral'}]);
      setIsTyping(false);
    },900+Math.random()*600);
  };

  const startSession=()=>{
    setPhase('chat');
    setChatLog([{type:'mentor',text:QUESTIONS[0].mentor,emotion:'neutral'}]);
    setCurrentQ(0);setAnswers({});setInputVal('');
  };

  const submitAnswer=(raw)=>{
    const q=QUESTIONS[currentQ];
    const val=raw||inputVal;
    if(!val)return;

    // ── VALIDATION: reject gibberish before doing anything ──
    if(q.type!=='choice'){
      const check=validateAnswer(q.id,val);
      if(!check.valid){
        // Show user bubble + mentor rejection WITHOUT advancing question
        const display=val;
        setChatLog(p=>[...p,{type:'user',text:display},{type:'mentor',text:check.msg,emotion:'frustrated'}]);
        setInputVal('');
        return; // <-- stays on same question
      }
    }

    const consistencyVal=q.field==='consistency'?val:answers.consistency;
    const emo=detectEmotion(typeof val==='string'?val:'');
    const reply=quickMentorReply(q.id,val,consistencyVal);
    const newAnswers={...answers,[q.field]:val};
    setAnswers(newAnswers);
    const display=q.type==='choice'?q.options?.find(o=>o.value===val)?.label||val:val;
    setChatLog(p=>[...p,{type:'user',text:display}]);
    setInputVal('');setIsTyping(true);
    setTimeout(()=>{
      setIsTyping(false);
      const next=currentQ+1;
      if(next<QUESTIONS.length){
        setChatLog(p=>[...p,{type:'mentor',text:reply,emotion:emo},{type:'mentor',text:QUESTIONS[next].mentor,emotion:'neutral'}]);
        setCurrentQ(next);
      } else {
        setChatLog(p=>[...p,{type:'mentor',text:reply,emotion:emo},{type:'mentor',text:"Alright. I've heard everything I need to hear. Give me a moment to assess you…",emotion:'neutral'}]);
        setTimeout(()=>{const r=analyzeUser(newAnswers);setAnalysis(r);setPhase('result');},2000);
      }
    },1100);
  };

  const reset=()=>{setPhase('intro');setChatLog([]);setCurrentQ(0);setInputVal('');setAnswers({});setAnalysis(null);setUserInsists(false);setActiveTab('result');};

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if(phase==='intro') return(
    <div className="p-6 min-h-screen flex flex-col items-center justify-center animate-fade-in">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold mb-6">
          <RiPsychotherapyLine/>HUMAN DECISION ENGINE · MENTOR MODE
        </div>
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
          <RiBrainLine className="text-white text-5xl"/>
        </div>
        <h1 className="text-4xl font-black text-white mb-3 leading-tight">
          Meet Your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Strict Mentor</span>
        </h1>
        <p className="text-slate-500 text-base leading-relaxed mb-6 max-w-lg mx-auto">
          A <strong className="text-white">Human Decision System</strong> that reads your emotions, challenges your thinking, detects unrealistic goals, and lets you ask <strong className="text-purple-300">unlimited questions</strong> — like a real mentor who actually cares.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {[
            {icon:RiHeartLine,text:'Emotionally Intelligent',color:'text-pink-400'},
            {icon:RiFireLine,text:'Brutally Honest',color:'text-red-400'},
            {icon:RiAlertLine,text:'Detects Contradictions',color:'text-amber-400'},
            {icon:RiBarChartLine,text:'Human Readiness Score',color:'text-blue-400'},
            {icon:RiMedalLine,text:'Action Plan',color:'text-emerald-400'},
            {icon:RiTimeLine,text:'Unlimited Q&A',color:'text-purple-400'},
          ].map(({icon:Icon,text,color})=>(
            <div key={text} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/40/5 rounded-xl border border-white/5 text-xs text-slate-300">
              <Icon className={`${color} text-sm`}/>{text}
            </div>
          ))}
        </div>
        <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl mb-8 text-left">
          <div className="flex items-center gap-2 mb-1">
            <RiHeartLine className="text-pink-400"/>
            <p className="text-pink-400 font-bold text-sm">This mentor understands how you feel.</p>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">Whether you're scared, frustrated, hopeless, or confused — the mentor will acknowledge your emotion first, then give you the honest truth. After the assessment, ask unlimited questions anytime.</p>
        </div>
        <button id="start-mentor-session" onClick={startSession}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-4 rounded-2xl text-base hover:from-purple-500 hover:to-blue-500 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 active:scale-95">
          <RiRocketLine/>Begin Mentor Session<RiArrowRightLine/>
        </button>
      </div>
    </div>
  );

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if(phase==='result'&&analysis){
    const {humanReadinessScore,verdict,verdictColor,verdictEmoji,effortScore,consistencyScore,projectScore,disciplineScore,contradictions,betterPath,betterReason,actions,careerGoal,experienceLevel}=analysis;
    const vs={emerald:{bg:'bg-emerald-500/10',border:'border-emerald-500/30',text:'text-emerald-400'},amber:{bg:'bg-amber-500/10',border:'border-amber-500/30',text:'text-amber-400'},red:{bg:'bg-red-500/10',border:'border-red-500/30',text:'text-red-400'}}[verdictColor];

    return(
      <div className="flex flex-col h-screen max-h-screen">
        {/* Top bar */}
        <div className="p-4 border-b border-white/5 bg-slate-900/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"><RiBrainLine className="text-white"/></div>
            <div><p className="text-white font-bold text-sm">Mentor Mode</p><p className="text-xs text-slate-400">Assessment complete — ask unlimited questions below</p></div>
          </div>
          <button onClick={reset} className="flex items-center gap-2 text-slate-500 hover:text-primary-400 transition-colors text-sm border border-white/10 hover:border-primary-500/30 px-3 py-2 rounded-xl">
            <RiRefreshLine/>Start Over
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 bg-slate-900/40 flex-shrink-0">
          {[{id:'result',label:'📊 Reality Check'},{id:'chat',label:'💬 Ask Mentor (Unlimited)'}].map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${activeTab===t.id?'text-purple-400 border-b-2 border-purple-500 bg-purple-500/5':'text-slate-400 hover:text-slate-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab==='result'?(
            <div className="p-6 max-w-5xl mx-auto space-y-5 animate-fade-in">
              {/* Reality Check Card */}
              <div className={`neon-glass-card p-6 border ${vs.border} ${vs.bg}`}>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <ReadinessRing score={humanReadinessScore}/>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">YOUR REALITY CHECK</p>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2"><span className="text-slate-400 w-32">You want:</span><span className="text-white font-bold">{careerGoal}</span></div>
                      <div className="flex items-center gap-2"><span className="text-slate-400 w-32">Current level:</span><span className="text-white font-bold capitalize">{experienceLevel}</span></div>
                      <div className="flex items-center gap-2"><span className="text-slate-400 w-32">Effort level:</span><span className={`font-bold ${effortScore>=70?'text-emerald-400':effortScore>=40?'text-amber-400':'text-red-400'}`}>{effortScore>=70?'High':effortScore>=40?'Medium':'Low'}</span></div>
                    </div>
                    <div className={`inline-block px-5 py-2 rounded-xl border ${vs.border} ${vs.bg} mb-3`}>
                      <p className={`text-xl font-black ${vs.text}`}>{verdictEmoji} {verdict}</p>
                    </div>
                    {betterPath&&(
                      <div className="mt-3 p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                        <p className="text-xs text-primary-400 font-bold uppercase tracking-wider mb-1">MENTOR SUGGESTS</p>
                        <p className="text-white font-bold">{betterPath}</p>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">{betterReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Score Breakdown */}
                <div className="neon-glass-card p-6">
                  <div className="flex items-center gap-2 mb-5"><RiStarLine className="text-primary-400 text-xl"/><h3 className="font-bold text-white">Human Readiness Score</h3></div>
                  <div className="space-y-3">
                    <ScoreBar label="Study Effort" value={effortScore} color="gold"/>
                    <ScoreBar label="Consistency" value={consistencyScore} color="purple"/>
                    <ScoreBar label="Project Depth" value={projectScore} color="blue"/>
                    <ScoreBar label="Discipline" value={disciplineScore} color={disciplineScore>=60?'emerald':'red'}/>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-sm text-slate-500">Overall</span>
                    <span className={`text-2xl font-black ${humanReadinessScore>=70?'text-emerald-400':humanReadinessScore>=45?'text-amber-400':'text-red-400'}`}>{humanReadinessScore}/100</span>
                  </div>
                </div>

                {/* Contradictions */}
                <div className="neon-glass-card p-6">
                  <div className="flex items-center gap-2 mb-5"><RiThunderstormsLine className="text-red-400 text-xl"/><h3 className="font-bold text-white">Contradiction Detector</h3></div>
                  {contradictions.length===0?(
                    <div className="text-center py-6"><RiCheckboxCircleLine className="text-4xl text-emerald-400 mx-auto mb-2"/><p className="text-emerald-400 font-bold">No contradictions found.</p><p className="text-slate-400 text-xs mt-1">Your goals align with your actions.</p></div>
                  ):(
                    <div className="space-y-4">{contradictions.map((c,i)=>(
                      <div key={i} className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <div className="flex items-start gap-2 mb-2"><RiAlertLine className="text-red-400 flex-shrink-0 mt-0.5"/><p className="text-red-300 text-sm font-semibold">{c.conflict}</p></div>
                        <p className="text-slate-500 text-xs leading-relaxed pl-5">{c.reality}</p>
                      </div>
                    ))}</div>
                  )}
                </div>

                {/* If insisting */}
                {verdict!=='REALISTIC'&&betterPath&&(
                  <div className="neon-glass-card p-6">
                    <div className="flex items-center gap-2 mb-5"><RiShieldLine className="text-amber-400 text-xl"/><h3 className="font-bold text-white">If You Still Insist</h3></div>
                    <div className="space-y-3 mb-5">
                      {['Burnout risk within 2–4 months without fixing study patterns.','2–3x longer than average without daily consistency.','High chance of quitting when material gets hard.','Applications ignored without real projects, regardless of certificates.'].map((w,i)=>(
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-500"><span className="text-amber-400 flex-shrink-0">⚠</span>{w}</div>
                      ))}
                    </div>
                    <button onClick={()=>setUserInsists(true)} className="w-full py-2.5 text-sm text-slate-500 border border-white/5 hover:border-amber-500/30 hover:text-amber-400 rounded-xl transition-all">
                      I understand, but I still want {careerGoal}
                    </button>
                    {userInsists&&(
                      <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/30 rounded-xl slide-in-left">
                        <p className="text-amber-400 font-bold text-sm mb-1">Stubborn. Good — I can work with that.</p>
                        <p className="text-slate-500 text-xs leading-relaxed">Then prove it. Wake up tomorrow, code 3+ hours. Every day. In 6 months, we'll see who was right.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Plan */}
                <div className="neon-glass-card p-6">
                  <div className="flex items-center gap-2 mb-5"><RiRocketLine className="text-blue-400 text-xl"/><h3 className="font-bold text-white">Mandatory Action Plan</h3></div>
                  <p className="text-xs text-slate-400 mb-4 italic">"You must do these. Not 'try'. Do."</p>
                  <div className="space-y-3">{actions.map((a,i)=>(
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl">
                      <span className="w-5 h-5 flex-shrink-0 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center justify-center font-bold mt-0.5">{i+1}</span>
                      <p className="text-slate-300 text-sm leading-relaxed">{a}</p>
                    </div>
                  ))}</div>
                </div>
              </div>

              <AccountabilityTracker actions={actions}/>

              {/* CTA to chat */}
              <div className="neon-glass-card p-5 bg-gradient-to-r from-purple-900/40 to-blue-900/30 border border-purple-500/20 flex items-center gap-4">
                <RiPsychotherapyLine className="text-purple-400 text-3xl flex-shrink-0"/>
                <div className="flex-1">
                  <p className="text-white font-bold">Have more questions?</p>
                  <p className="text-slate-500 text-sm">Switch to the <strong className="text-purple-300">Ask Mentor</strong> tab — ask anything, unlimited. Your mentor is here anytime.</p>
                </div>
                <button onClick={()=>setActiveTab('chat')} className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all">
                  Chat Now <RiArrowRightLine className="inline ml-1"/>
                </button>
              </div>
            </div>
          ):(
            <FreeChatPanel context={analysis}/>
          )}
        </div>
      </div>
    );
  }

  // ── CHAT (Assessment) ──────────────────────────────────────────────────────
  const q=QUESTIONS[currentQ];
  const progress=(currentQ/QUESTIONS.length)*100;
  return(
    <div className="flex flex-col h-screen max-h-screen">
      <div className="p-4 border-b border-white/5 bg-slate-900/40 flex items-center gap-4 flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <RiPsychotherapyLine className="text-white text-lg"/>
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Mentor Session</p>
          <p className="text-xs text-slate-400">Emotional Intelligence Active</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 bg-slate-900/40/10 rounded-full overflow-hidden hidden sm:block">
            <div style={{width:`${progress}%`}} className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-500"/>
          </div>
          <span className="text-xs text-slate-400">{Math.round(progress)}%</span>
          <button onClick={reset} className="text-slate-400 hover:text-red-400 transition-colors ml-2"><RiCloseLine size={18}/></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-900/60">
        {chatLog.map((m,i)=>m.type==='mentor'?<MentorBubble key={i}text={m.text}animate={i>=chatLog.length-2}emotion={m.emotion}/>:<UserBubble key={i}text={m.text}/>)}
        {isTyping&&<TypingBubble/>}
        <div ref={chatEndRef}/>
      </div>

      {!isTyping&&currentQ<QUESTIONS.length&&(
        <div className="p-4 border-t border-white/5 bg-slate-900/40 flex-shrink-0">
          {q.type==='choice'?(
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map(opt=>(
                <button key={opt.value} onClick={()=>submitAnswer(opt.value)}
                  className="p-3 text-left rounded-xl border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 text-slate-300 text-sm transition-all duration-200 hover:text-white">
                  {opt.label}
                </button>
              ))}
            </div>
          ):q.type==='textarea'?(
            <div className="flex gap-3 items-end">
              <textarea value={inputVal} onChange={e=>setInputVal(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&inputVal.trim()){e.preventDefault();submitAnswer();}}} placeholder={q.placeholder} rows={2}
                className="flex-1 bg-slate-900/40/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all duration-200 resize-none text-sm"/>
              <button onClick={()=>submitAnswer()} disabled={!inputVal.trim()}
                className="w-11 h-11 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center disabled:opacity-40 hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg">
                <RiSendPlaneLine className="text-white text-base"/>
              </button>
            </div>
          ):(
            <div className="flex gap-3 items-center">
              <input type="text" value={inputVal} onChange={e=>setInputVal(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&inputVal.trim())submitAnswer();}} placeholder={q.placeholder}
                className="flex-1 bg-slate-900/40/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all duration-200 text-sm"/>
              <button onClick={()=>submitAnswer()} disabled={!inputVal.trim()}
                className="w-11 h-11 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center disabled:opacity-40 hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg">
                <RiSendPlaneLine className="text-white text-base"/>
              </button>
            </div>
          )}
          <p className="text-xs text-slate-600 mt-2 px-1">Enter to send{q.type==='textarea'?' · Shift+Enter for new line':''}</p>
        </div>
      )}
    </div>
  );
}

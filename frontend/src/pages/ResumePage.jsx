import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { 
  RiFileTextLine, RiUploadCloud2Line, RiCheckLine, RiTimeLine, 
  RiPsychotherapyLine, RiErrorWarningLine, RiStarLine, RiCodeLine, 
  RiRoadMapLine, RiShieldUserLine, RiToggleLine, RiToggleFill, RiBookOpenLine, RiCloseLine
} from 'react-icons/ri';

export default function ResumePage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // New State for Recruiter Mode & Guide
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    axios.get('/api/resume').then(r => setResume(r.data)).catch(() => {}).finally(() => setFetching(false));
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setLoading(true); setError(''); setSuccess(false);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const { data } = await axios.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResume(data); setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally { setLoading(false); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1,
  });

  if (fetching) return <div className="p-6 flex items-center justify-center min-h-64"><div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
            <RiFileTextLine className="text-xl text-obsidian-900" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Resume Intelligence</h1>
            <p className="text-slate-400 text-sm">Deep AI analysis & job readiness evaluation</p>
          </div>
        </div>
        {resume && (
          <button 
            onClick={() => setRecruiterMode(!recruiterMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${recruiterMode ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-obsidian-800 text-slate-400 border-white/10 hover:border-white/20'}`}
          >
            {recruiterMode ? <><RiToggleFill className="text-xl" /> Recruiter Mode: ON</> : <><RiToggleLine className="text-xl" /> Recruiter Mode: OFF</>}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Upload & Basic Info */}
        <div className="space-y-6">
          {/* Upload Zone */}
          <div
            {...getRootProps()}
            className={`glass-card p-8 text-center cursor-pointer border-2 border-dashed transition-all duration-300 ${
              isDragActive ? 'border-gold-500/60 bg-gold-500/5' : 'border-white/10 hover:border-gold-500/30 hover:bg-white/2'
            }`}
          >
            <input {...getInputProps()} />
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-white font-semibold text-sm">Extracting Intelligence...</p>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <RiCheckLine className="text-2xl text-emerald-400" />
                </div>
                <p className="text-emerald-400 font-bold text-sm">Analysis Complete!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDragActive ? 'bg-gold-500/20' : 'bg-obsidian-700'}`}>
                  <RiUploadCloud2Line className={`text-xl ${isDragActive ? 'text-gold-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{isDragActive ? 'Drop it here!' : 'Drag & drop new resume'}</p>
                </div>
              </div>
            )}
          </div>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}

          {/* Current File Info */}
          {resume && (
            <div className="glass-card p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Active File</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RiFileTextLine className="text-red-400 text-lg" />
                </div>
                <div className="truncate">
                  <p className="text-white font-semibold text-sm truncate">{resume.originalName}</p>
                  <p className="text-slate-400 text-[10px] flex items-center gap-1 mt-1">
                    <RiTimeLine /> {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Cols: Assessment Dashboard */}
        {resume && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* recruiter verdict override */}
            {recruiterMode && (
              <div className={`glass-card p-6 border-l-4 ${resume.recruiterVerdict?.hire ? 'bg-emerald-900/20 border-l-emerald-500' : 'bg-red-900/20 border-l-red-500'}`}>
                <h3 className="text-lg font-black text-white flex items-center gap-2 mb-2">
                  <RiShieldUserLine className={resume.recruiterVerdict?.hire ? 'text-emerald-500' : 'text-red-500'} />
                  Would I hire this candidate? 
                  <span className={`px-3 py-0.5 rounded text-sm ${resume.recruiterVerdict?.hire ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {resume.recruiterVerdict?.hire ? 'YES' : 'NO'}
                  </span>
                </h3>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">{resume.recruiterVerdict?.reason}</p>
              </div>
            )}

            {/* Top Stats */}
            <div className="grid grid-cols-1 gap-4">
              <div className="glass-card p-5 text-center">
                <p className="text-xs font-bold text-emerald-400 uppercase mb-2">Readiness Status</p>
                <div className="flex items-center justify-center h-full pb-4 pt-2">
                  <span className={`px-4 py-2 rounded-xl text-sm font-black tracking-wide border ${resume.jobReadiness?.includes('Not') ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                    {resume.jobReadiness?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            </div>

            {/* Reality check & Project Issues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass-card p-5 bg-red-900/5 border border-red-500/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <RiPsychotherapyLine className="text-red-400" /> Reality Check
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed bg-obsidian-900 p-3 rounded-lg border-l-2 border-l-red-500">
                  {resume.realityCheck}
                </p>
              </div>

              <div className="glass-card p-5 bg-orange-900/5 border border-orange-500/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <RiErrorWarningLine className="text-orange-400" /> Project Issues Detected
                </h3>
                <ul className="space-y-2">
                  {resume.projectQuality?.issues?.map((issue, i) => (
                     <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                       <span className="text-orange-500">•</span> {issue}
                     </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Smart Skill Grouping & Missing Log */}
            <div className="glass-card p-6">
               <h3 className="section-title mb-5 flex items-center gap-2">
                 <RiCodeLine className="text-blue-400" /> Skill Evaluation Matrix
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    {/* Groups */}
                    {['frontend', 'backend', 'tools', 'database'].map(group => (
                       resume.groupedSkills && resume.groupedSkills[group] && resume.groupedSkills[group].length > 0 && (
                         <div key={group}>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{group}</p>
                           <div className="flex flex-wrap gap-1.5">
                             {resume.groupedSkills[group].map((s, i) => (
                               <span key={i} className="px-2 py-0.5 bg-obsidian-700 text-slate-300 border border-white/5 rounded text-[10px] uppercase">{s}</span>
                             ))}
                           </div>
                         </div>
                       )
                    ))}
                 </div>
                 
                 <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                    <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Detected Missing Skills</p>
                    <p className="text-[10px] text-slate-400 mb-3">Missing core tools commonly required for target roles.</p>
                    <div className="flex flex-wrap gap-2">
                      {resume.missingSkills?.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-red-500/10 text-red-300 border border-red-500/30 rounded text-xs font-semibold shrink-0">
                          {s}
                        </span>
                      ))}
                    </div>
                 </div>
               </div>
            </div>

            {/* Improvement Suggestions & Roadmap link */}
            <div className="glass-card p-6 bg-gradient-to-r from-obsidian-800 to-obsidian-900 border border-gold-500/20">
               <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                 <div className="flex-1">
                   <h3 className="text-md font-bold text-white flex items-center gap-2 mb-3">
                     <RiStarLine className="text-gold-400" /> Improve Your Resume
                   </h3>
                   <ul className="space-y-2">
                     {resume.improvements?.map((imp, i) => (
                       <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                         <RiCheckLine className="text-green-500 mt-1 shrink-0" /> {imp}
                       </li>
                     ))}
                   </ul>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                   <button onClick={() => setShowGuide(true)} className="btn-gold flex items-center justify-center gap-2 w-full text-xs py-2 bg-obsidian-800 hover:bg-gold-500/10 hover:text-gold-400 border border-gold-500/30">
                     <RiBookOpenLine /> View Perfect Resume Guide
                   </button>
                   <Link to="/mentor?action=fix_resume" className="btn-gold whitespace-nowrap flex items-center justify-center gap-2">
                     <RiRoadMapLine /> Fix My Resume
                   </Link>
                 </div>
               </div>
            </div>

          </div>
        )}
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-obsidian-800/50">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <RiBookOpenLine className="text-gold-400" /> The Perfect Developer Resume
              </h2>
              <button onClick={() => setShowGuide(false)} className="text-slate-400 hover:text-white transition-colors bg-obsidian-800 p-2 rounded-lg">
                <RiCloseLine size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 text-slate-300">
              
              <section>
                <h3 className="text-white font-bold text-lg mb-2">🔹 1. Header (Basic Info)</h3>
                <p className="text-sm mb-2">Keep it simple and professional. Focus on accessibility.</p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-slate-400">
                  <li>Full Name</li>
                  <li>Phone Number & Email</li>
                  <li><strong>GitHub link ⭐ (very important for developers)</strong></li>
                  <li>Portfolio website & LinkedIn profile</li>
                </ul>
              </section>

              <section>
                <h3 className="text-white font-bold text-lg mb-2">🔹 2. Professional Summary (2–4 lines)</h3>
                <p className="text-sm mb-2">Short intro about you + your goal.</p>
                <div className="bg-obsidian-950 p-4 rounded-lg border-l-2 border-gold-500 text-sm italic">
                  "Front-End Developer skilled in HTML, CSS, JavaScript, and React. Passionate about building responsive and user-friendly web applications. Seeking an opportunity to apply my skills and grow as a developer."
                </div>
              </section>

              <section>
                <h3 className="text-white font-bold text-lg mb-2">🔹 3. Skills (Highly Scanned)</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong className="text-blue-400">Technical Skills:</strong><br/>HTML5, CSS3, JavaScript, React.js, Tailwind CSS, Git</div>
                  <div><strong className="text-orange-400">Tools:</strong><br/>VS Code, Figma, Chrome DevTools</div>
                </div>
              </section>

              <section>
                <h3 className="text-white font-bold text-lg mb-2">🔹 4. Projects (MOST IMPORTANT 🔥)</h3>
                <p className="text-sm mb-2">Add 2–4 solid projects. Quality &gt; Quantity. For each include:</p>
                <ul className="list-disc pl-5 text-sm space-y-1 text-slate-400 mb-3">
                  <li>Project Name & Short description</li>
                  <li>Tech stack used</li>
                  <li>Live Demo link + GitHub repo link</li>
                </ul>
                <div className="bg-obsidian-950 p-4 rounded-lg border-l-2 border-emerald-500 text-sm">
                  <strong>GitHub Portfolio Analyzer</strong><br/>
                  <span className="text-slate-400">Built a tool to analyze GitHub profiles and display insights. Used React, API integration, and modern UI design.</span><br/>
                  <a href="#" className="text-blue-400">Live Link</a> | <a href="#" className="text-blue-400">GitHub</a>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <h3 className="text-white font-bold mb-2">🔹 5. Education</h3>
                  <p className="text-sm text-slate-400">Degree, College name, Graduation Year.</p>
                </section>
                <section>
                  <h3 className="text-white font-bold mb-2">🔹 6. Experience</h3>
                  <p className="text-sm text-slate-400">Internship / Freelance. If no experience → expand "Projects".</p>
                </section>
              </div>

              <section className="bg-gold-500/10 p-5 rounded-xl border border-gold-500/20">
                <h3 className="text-gold-400 font-black text-lg mb-3">🚀 Pro Tips (VERY IMPORTANT)</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><RiCheckLine className="text-gold-500 shrink-0 mt-0.5"/> <strong>Keep it 1 page only.</strong></li>
                  <li className="flex gap-2"><RiCheckLine className="text-gold-500 shrink-0 mt-0.5"/> <strong>Simple design.</strong> No heavy colors or weird formats that break ATS.</li>
                  <li className="flex gap-2"><RiCheckLine className="text-gold-500 shrink-0 mt-0.5"/> <strong>Show, don't tell.</strong> Don’t write “hardworking, passionate” → prove it via complex projects.</li>
                  <li className="flex gap-2"><RiCheckLine className="text-gold-500 shrink-0 mt-0.5"/> <strong>Action Words.</strong> Start points with Built, Developed, Designed.</li>
                </ul>
              </section>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Trophy, Target, Brain, Sparkles, CheckCircle2, XCircle,
  TrendingUp, FileText, Zap, Award, BarChart3, Download, MessageSquare, Info, Wand2, Copy, AlertCircle,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { rewriteBullet, generateCoverLetter } from "../services/api";
import CoverLetterModal from "./CoverLetterModal";
import InterviewChat from "./InterviewChat";
import html2pdf from "html2pdf.js";
import "./Dashboard.css";

/* Animated SVG score ring */
function ScoreRing({ score, size = 180, stroke = 14 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const circleRef = useRef(null);

  const color = score >= 80 ? "var(--accent-green)" : score >= 60 ? "var(--accent-orange)" : score >= 40 ? "var(--accent-blue)" : "var(--accent-red)";
  const label = score >= 80 ? "Excellent Match" : score >= 60 ? "Good Match" : score >= 40 ? "Average Match" : "Needs Work";

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.transition = "none";
      circleRef.current.setAttribute("stroke-dashoffset", circ);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          circleRef.current.style.transition = "stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)";
          circleRef.current.setAttribute("stroke-dashoffset", offset);
        });
      });
    }
  }, [score, circ, offset]);

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle ref={circleRef} cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      <div className="score-ring__inner">
        <span className="score-ring__val" style={{ color }}>{score}</span>
        <span className="score-ring__lbl">{label}</span>
      </div>
    </div>
  );
}

/* Mini score bar */
function MiniScore({ icon, label, value, color }) {
  const barRef = useRef(null);
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { barRef.current.style.width = value + "%"; });
      });
    }
  }, [value]);

  return (
    <div className="mini-score">
      <div className="mini-score__header">
        <div className="mini-score__icon" style={{ background: `rgba(255,255,255,0.05)`, color }}>
          {icon}
        </div>
        <span className="mini-score__val" style={{ color }}>{value}%</span>
      </div>
      <span className="mini-score__lbl">{label}</span>
      <div className="mini-score__track">
        <div ref={barRef} className="mini-score__fill" style={{ background: color, width: 0, transition: "width 1s cubic-bezier(0.22,1,0.36,1) 0.3s" }} />
      </div>
    </div>
  );
}

function Dashboard({ data, onReset }) {
  if (!data) return null;
  const { match, score, feedback, questions, jobDescription, domain } = data;

  const [rewriteInput, setRewriteInput] = useState("");
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteSuggestions, setRewriteSuggestions] = useState(null);
  const [rewriteError, setRewriteError] = useState("");

  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState("");
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);

  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const handleGenerateCoverLetter = async () => {
    setCoverLetterLoading(true);
    try {
      const res = await generateCoverLetter({ 
        resumeText: data.text, 
        jobDescription: data.jobDescription 
      });
      setCoverLetterText(res.data.coverLetter);
      setShowCoverLetterModal(true);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to generate cover letter.");
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!rewriteInput.trim()) return;
    setRewriteLoading(true);
    setRewriteError("");
    setRewriteSuggestions(null);
    try {
      const res = await rewriteBullet({ bulletPoint: rewriteInput, jobDescription, domain });
      setRewriteSuggestions(res.data.suggestions);
    } catch (err) {
      setRewriteError("Failed to generate suggestions. Please try again.");
    } finally {
      setRewriteLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handlePrint = () => {
    const element = document.getElementById("report-content");
    const opt = {
      margin:       0.5,
      filename:     'Resume_Analysis_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0c0a09' },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // Parse feedback — handles both "\n"-separated and inline "1. ... 2. ..." numbered formats
  const feedbackLines = (() => {
    const raw = (feedback || "").trim();
    if (!raw) return [];
    // Try splitting by newlines first
    const byNewline = raw.split(/\n+/).map(s => s.trim()).filter(Boolean);
    // If we only get 1 item but it contains numbered list patterns, split by them
    if (byNewline.length <= 2) {
      const byNumber = raw.split(/(?=\d+\.\s)/).map(s => s.trim()).filter(Boolean);
      if (byNumber.length > 1) return byNumber;
    }
    return byNewline;
  })();

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <section className="dash-section">
      <div className="dash" id="report-content">
        
        {/* Header */}
        <motion.div 
          className="dash__hdr"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="dash__actions">
            <button className="dash__btn" onClick={onReset}>
              <ArrowLeft size={16} /> New Analysis
            </button>
            <button className="dash__btn" onClick={handleGenerateCoverLetter} disabled={coverLetterLoading}>
              {coverLetterLoading ? <span className="spinner" style={{borderColor:"rgba(255,255,255,0.3)", borderTopColor:"#fff", width:"14px", height:"14px", borderWidth:"2px"}}></span> : <FileText size={16} />} 
              {coverLetterLoading ? "Generating..." : "Cover Letter"}
            </button>
            <button className="dash__btn dash__btn--primary" onClick={handlePrint}>
              <Download size={16} /> Export PDF
            </button>
          </div>
          <div className="dash__title-row">
            <div>
              <h1 className="dash__title">Analysis Results</h1>
              <div className="dash__domain">
                <Briefcase size={16} className="c-muted" />
                <span className="dash__domain-label">Target Role:</span> {data.domain || "Software Engineering"}
              </div>
            </div>
            <span className="dash__ai-badge">
              <Sparkles size={14} /> AI Report
            </span>
          </div>
        </motion.div>

        {/* Nudge banner */}
        {match.generalAnalysis && (
          <motion.div 
            className="dash__nudge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Info size={18} className="dash__nudge-icon" />
            <div className="dash__nudge-content">
              These scores reflect your <strong>general resume quality</strong>, not a specific job match.
              <button className="dash__nudge-btn" onClick={onReset}>Add a job description</button> 
              to get a targeted ATS match score.
            </div>
          </motion.div>
        )}

        {/* Bento Grid Layout */}
        <motion.div 
          className="bento-grid"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          
          {/* 1. Main Score Card */}
          <motion.div className="bcard bcard--main-score" variants={cardVariant}>
            <div className="bcard__header">
              <Trophy size={18} /> <span>Overall ATS Match</span>
            </div>
            <div className="bcard__content-center">
              <ScoreRing score={match.finalScore} />
              
              <div className="main-score__stats">
                <div className="mstat">
                  <span className="mstat__lbl"><CheckCircle2 size={14} className="c-green" /> Matched</span>
                  <span className="mstat__val">{match.matchingSkills.length} Skills</span>
                </div>
                <div className="mstat-div"></div>
                <div className="mstat">
                  <span className="mstat__lbl"><XCircle size={14} className="c-red" /> Missing</span>
                  <span className="mstat__val">{match.missingSkills.length} Skills</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Mini Scores Grid */}
          <motion.div className="bcard bcard--mini-scores" variants={cardVariant}>
            <div className="bcard__header">
              <BarChart3 size={18} /> <span>Score Breakdown</span>
            </div>
            <div className="mini-scores-grid">
              <MiniScore icon={<Target size={18}/>} label="Skills Match" value={match.skillsScore} color="var(--accent-secondary)" />
              <MiniScore icon={<TrendingUp size={18}/>} label="Experience" value={match.experienceScore} color="var(--accent-green)" />
              <MiniScore icon={<Award size={18}/>} label="Education" value={match.educationScore} color="var(--accent-blue)" />
              <MiniScore icon={<Zap size={18}/>} label="Keywords" value={match.keywordScore} color="var(--accent-orange)" />
            </div>
          </motion.div>

          {/* 3. Skills Mapping */}
          <motion.div className="bcard bcard--skills" variants={cardVariant}>
            <div className="bcard__header">
              <Target size={18} /> <span>Skills Mapping</span>
            </div>
            <div className="bcard__skills-content">
              <div className="skills-col">
                <div className="skills-hdr">
                  <CheckCircle2 size={16} className="c-green" /> 
                  <span>Found in Resume</span> 
                  <span className="skills-cnt c-green-bg">{match.matchingSkills.length}</span>
                </div>
                <div className="skills-tags">
                  {match.matchingSkills.length > 0
                    ? match.matchingSkills.map((s) => <span key={s} className="stag stag--ok">{s}</span>)
                    : <span className="skills-empty">No matching skills detected.</span>}
                </div>
              </div>
              
              <div className="skills-col">
                <div className="skills-hdr">
                  <XCircle size={16} className="c-red" /> 
                  <span>Missing (Add These)</span> 
                  <span className="skills-cnt c-red-bg">{match.missingSkills.length}</span>
                </div>
                <div className="skills-tags">
                  {match.missingSkills.length > 0
                    ? match.missingSkills.map((s) => <span key={s} className="stag stag--miss">{s}</span>)
                    : <span className="skills-empty skills-empty--ok"><Sparkles size={16}/> Perfect match!</span>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. Actionable Feedback — own card */}
          <motion.div className="bcard bcard--feedback" variants={cardVariant}>
            <div className="bcard__header">
              <Brain size={18} /> <span>Actionable Feedback</span>
            </div>
            {feedbackLines.length === 0 ? (
              <p className="ai-empty">No feedback available.</p>
            ) : (
              <div className="ai-list">
                {feedbackLines.map((line, i) => {
                  const clean = line.replace(/^\d+\.\s*/, "").replace(/^[•\-*]\s*/, "").trim();
                  if (!clean) return null;
                  return (
                    <div key={i} className="ai-item">
                      <div className="ai-num">0{i + 1}</div>
                      <span>{clean}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* 5. Interview Prep — own card */}
          {questions && questions.length > 0 && (
            <motion.div className="bcard bcard--interview" variants={cardVariant}>
              <div className="bcard__header">
                <MessageSquare size={18} /> <span>Interview Prep</span>
              </div>
              <div className="q-list">
                {questions.map((q, i) => (
                  <div key={i} className="q-card">
                    <div className="q-num">Q{i + 1}</div>
                    <div className="q-text">{q}</div>
                  </div>
                ))}
              </div>
              <button 
                  className="dash__btn dash__btn--primary" 
                  style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}
                  onClick={() => setShowInterviewModal(true)}
                >
                  <MessageSquare size={16} /> Start AI Mock Interview
              </button>
            </motion.div>
          )}

          {/* 5. AI Bullet Rewriter */}
          <motion.div className="bcard bcard--rewriter" variants={cardVariant}>
            <div className="bcard__header">
              <Wand2 size={18} /> <span>AI Bullet Rewriter</span>
            </div>
            <div className="rewriter-content">
              <p className="rewriter-desc">
                Paste a weak bullet point from your resume. Our AI will rewrite it using the STAR method, perfectly tailored to your target job.
              </p>
              
              <div className="rewriter-input-group">
                <textarea 
                  className="rewriter-textarea"
                  placeholder="e.g., I coded the frontend for the application..."
                  value={rewriteInput}
                  onChange={(e) => setRewriteInput(e.target.value)}
                  rows={4}
                />
                <button 
                  className="rewriter-btn"
                  onClick={handleRewrite}
                  disabled={!rewriteInput.trim() || rewriteLoading}
                >
                  {rewriteLoading ? <span className="spinner"></span> : <><Wand2 size={16} /> Rewrite Bullet</>}
                </button>
              </div>

              {rewriteError && (
                <div className="rewriter-alert">
                  <AlertCircle size={16} /> {rewriteError}
                </div>
              )}

              {rewriteSuggestions && (
                <div className="rewriter-results">
                  <p className="rewriter-results-title">AI Suggestions:</p>
                  <div className="rewriter-suggestions">
                    {rewriteSuggestions.map((s, i) => (
                      <div key={i} className="rsug-card">
                        <div className="rsug-text">{s}</div>
                        <button className="rsug-copy" onClick={() => copyToClipboard(s)} title="Copy to clipboard">
                          <Copy size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
      </div>
      
      {showCoverLetterModal && (
        <CoverLetterModal 
          coverLetter={coverLetterText}
          onClose={() => setShowCoverLetterModal(false)}
        />
      )}

      {showInterviewModal && (
        <InterviewChat
          resumeText={data.text}
          jobDescription={data.jobDescription}
          onClose={() => setShowInterviewModal(false)}
        />
      )}
    </section>
  );
}

export default Dashboard;

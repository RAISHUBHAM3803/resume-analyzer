import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";
import {
  ArrowLeft, Trophy, Target, Brain, Sparkles, CheckCircle2, XCircle,
  TrendingUp, FileText, Zap, Award, BarChart3, Download, MessageSquare, Info, Wand2, Copy, AlertCircle
} from "lucide-react";
import { rewriteBullet } from "../services/api";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* Animated SVG score ring */
function ScoreRing({ score, size = 160, stroke = 12 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const circleRef = useRef(null);

  const color = score >= 80 ? "var(--accent-green)" : score >= 60 ? "var(--accent-orange)" : score >= 40 ? "var(--accent-blue)" : "var(--accent-red)";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Average" : "Needs Work";

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
      <div className="mini-score__icon" style={{ background: `rgba(255,255,255,0.05)`, color }}>
        {icon}
      </div>
      <div className="mini-score__info">
        <span className="mini-score__lbl">{label}</span>
        <span className="mini-score__val" style={{ color }}>{value}%</span>
      </div>
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
    window.print();
  };

  const barData = {
    labels: ["Skills", "Experience", "Education", "Keywords"],
    datasets: [{
      label: "Score",
      data: [match.skillsScore, match.experienceScore, match.educationScore, match.keywordScore],
      backgroundColor: ["rgba(99,102,241,0.6)", "rgba(16,185,129,0.6)", "rgba(59,130,246,0.6)", "rgba(245,158,11,0.6)"],
      borderColor: ["#6366f1", "#10b981", "#3b82f6", "#f59e0b"],
      borderWidth: 2, borderRadius: 8, borderSkipped: false,
    }],
  };

  const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(18,19,32,0.95)", padding: 12, cornerRadius: 8,
        borderColor: "rgba(255,255,255,0.1)", borderWidth: 1,
        titleFont: { family: "Inter", size: 14, weight: "bold" },
        bodyFont: { family: "Inter", size: 13 }
      },
    },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9ca3af", stepSize: 25, font: { family: "Inter" } }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: "#9ca3af", font: { family: "Inter" } }, border: { display: false } },
    },
  };

  const feedbackLines = (feedback || "").split("\n").filter(Boolean);

  return (
    <section className="dash-section">
      <div className="dash fade-in-up" id="report-content">
        {/* Header */}
        <div className="dash__hdr">
          <div className="dash__actions">
            <button className="dash__btn" onClick={onReset}>
              <ArrowLeft size={16} /> New Analysis
            </button>
            <button className="dash__btn dash__btn--primary" onClick={handlePrint}>
              <Download size={16} /> Download PDF
            </button>
          </div>
          <div className="dash__title-row">
            <div>
              <h1 className="dash__title">Analysis Results</h1>
              <div className="dash__domain">
                <span className="dash__domain-label">Domain:</span> {data.domain || "Software Engineering"}
              </div>
            </div>
            <span className="dash__ai-badge">
              <Sparkles size={14} /> AI Report
            </span>
          </div>
        </div>

        {/* Nudge banner — only shown when no job description was used */}
        {match.generalAnalysis && (
          <div className="dash__nudge fade-in">
            <Info size={18} className="dash__nudge-icon" />
            <div className="dash__nudge-content">
              These scores reflect your <strong>general resume quality</strong>, not a specific job match.
              <button className="dash__nudge-btn" onClick={onReset}>Add a job description</button> 
              to get a targeted ATS match score.
            </div>
          </div>
        )}

        <div className="dash__grid">
          {/* Hero card */}
          <div className="dcard dcard--hero">
            <div className="dcard__hero-left">
              <div className="dcard__hero-lbl"><Trophy size={18} /> Overall Job Match</div>
              <ScoreRing score={match.finalScore} />
            </div>
            
            <div className="dcard__hero-center">
              <div className="mini-stat">
                <div className="mini-stat__hdr">
                  <span className="mini-stat__lbl"><FileText size={16} /> Structure</span>
                  <span className="mini-stat__val">{match.structureScore}%</span>
                </div>
                <div className="mini-stat__bar"><div className="mini-stat__fill" style={{ width: `${match.structureScore}%`, background: "var(--accent-secondary)" }}></div></div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat__hdr">
                  <span className="mini-stat__lbl"><CheckCircle2 size={16} /> Contact Info</span>
                  <span className="mini-stat__val">{match.contactScore}%</span>
                </div>
                <div className="mini-stat__bar"><div className="mini-stat__fill" style={{ width: `${match.contactScore}%`, background: "var(--accent-green)" }}></div></div>
              </div>
            </div>

            <div className="dcard__hero-right">
              <div className="dcard__ats">
                <span className="dcard__ats-lbl">ATS Match Score</span>
                <span className="dcard__ats-val">{score}<span className="dcard__ats-max">/100</span></span>
              </div>
              <div className="dcard__hero-stats">
                <div className="dcard__hstat">
                  <div className="dcard__hstat-icon" style={{color: "var(--accent-green)"}}><CheckCircle2 size={16} /></div>
                  <div className="dcard__hstat-content">
                    <span className="dcard__hstat-val">{match.matchingSkills.length}</span>
                    <span className="dcard__hstat-lbl">Skills Matched</span>
                  </div>
                </div>
                <div className="dcard__hstat">
                  <div className="dcard__hstat-icon" style={{color: "var(--accent-red)"}}><XCircle size={16} /></div>
                  <div className="dcard__hstat-content">
                    <span className="dcard__hstat-val">{match.missingSkills.length}</span>
                    <span className="dcard__hstat-lbl">Skills Missing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini scores */}
          <div className="dcard dcard--scores">
            <div className="dcard__label"><BarChart3 size={16} /> Score Breakdown</div>
            <div className="mini-grid">
              <MiniScore icon={<Target size={18}/>} label="Skills Match" value={match.skillsScore} color="var(--accent-secondary)" />
              <MiniScore icon={<TrendingUp size={18}/>} label="Experience" value={match.experienceScore} color="var(--accent-green)" />
              <MiniScore icon={<Award size={18}/>} label="Education" value={match.educationScore} color="var(--accent-blue)" />
              <MiniScore icon={<Zap size={18}/>} label="Keywords" value={match.keywordScore} color="var(--accent-orange)" />
            </div>
          </div>

          {/* Chart */}
          <div className="dcard dcard--chart">
            <div className="dcard__label"><BarChart3 size={16} /> Visual Breakdown</div>
            <div className="chart-wrap"><Bar data={barData} options={barOpts} /></div>
          </div>

          {/* Skills */}
          <div className="dcard dcard--skills">
            <div className="dcard__label"><Target size={16} /> Skills Mapping</div>
            <div className="skills-grid">
              <div className="skills-group">
                <div className="skills-hdr">
                  <CheckCircle2 size={18} className="c-green" /> 
                  <span>Matching Skills</span> 
                  <span className="skills-cnt c-green-bg">{match.matchingSkills.length}</span>
                </div>
                <div className="skills-tags">
                  {match.matchingSkills.length > 0
                    ? match.matchingSkills.map((s) => <span key={s} className="stag stag--ok"><CheckCircle2 size={14}/> {s}</span>)
                    : <span className="skills-empty">No matching skills detected. Consider adding some from the job description.</span>}
                </div>
              </div>
              <div className="skills-group">
                <div className="skills-hdr">
                  <XCircle size={18} className="c-red" /> 
                  <span>Missing Skills</span> 
                  <span className="skills-cnt c-red-bg">{match.missingSkills.length}</span>
                </div>
                <div className="skills-tags">
                  {match.missingSkills.length > 0
                    ? match.missingSkills.map((s) => <span key={s} className="stag stag--miss"><XCircle size={14}/> {s}</span>)
                    : <span className="skills-empty skills-empty--ok"><Sparkles size={16}/> Perfect match! Your resume contains all key skills.</span>}
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="dcard dcard--ai">
            <div className="dcard__label dcard__label--ai">
              <Brain size={16} /> AI Recommendations <span className="ai-pill">Powered by AI</span>
            </div>
            <ul className="ai-list">
              {feedbackLines.map((line, i) => (
                <li key={i} className="ai-item fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
                  <div className="ai-bullet"><Sparkles size={14}/></div>
                  <span>{line.replace(/^[•-]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* AI Mock Interview Questions */}
          {questions && questions.length > 0 && (
            <div className="dcard dcard--ai dcard--interview">
              <div className="dcard__label dcard__label--ai">
                <MessageSquare size={16} /> Mock Interview Prep <span className="ai-pill ai-pill--alt">Powered by AI</span>
              </div>
              <p className="interview-desc">Practice answering these technical questions tailored to the skills found on your resume:</p>
              <div className="q-list">
                {questions.map((q, i) => (
                  <div key={i} className="q-card fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
                    <div className="q-num">Q{i + 1}</div>
                    <div className="q-text">{q}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Resume Tailoring (Auto-Rewriter) */}
          <div className="dcard dcard--ai dcard--rewriter">
            <div className="dcard__label dcard__label--ai">
              <Wand2 size={16} /> Resume Tailoring <span className="ai-pill ai-pill--alt">Powered by AI</span>
            </div>
            <p className="rewriter-desc">Paste a bullet point from your resume to rewrite it using the STAR method, tailored to your target job description.</p>
            
            <div className="rewriter-input-group">
              <textarea 
                className="rewriter-textarea"
                placeholder="e.g., I coded the frontend for the application..."
                value={rewriteInput}
                onChange={(e) => setRewriteInput(e.target.value)}
                rows={3}
              />
              <button 
                className="rewriter-btn"
                onClick={handleRewrite}
                disabled={!rewriteInput.trim() || rewriteLoading}
              >
                {rewriteLoading ? <span className="spinner"></span> : <><Wand2 size={16} /> Rewrite</>}
              </button>
            </div>

            {rewriteError && (
              <div className="rewriter-alert">
                <AlertCircle size={16} /> {rewriteError}
              </div>
            )}

            {rewriteSuggestions && (
              <div className="rewriter-results fade-in">
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
        </div>
      </div>
    </section>
  );
}

export default Dashboard;

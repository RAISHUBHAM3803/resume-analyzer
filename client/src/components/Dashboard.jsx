import { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";
import {
  ArrowLeft, Trophy, Target, Brain, Sparkles, CheckCircle2, XCircle,
  TrendingUp, FileText, Zap, Award, BarChart3, Download, MessageSquare, Info
} from "lucide-react";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* Animated SVG score ring */
function ScoreRing({ score, size = 140, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const circleRef = useRef(null);

  const color = score >= 80 ? "#00d4aa" : score >= 60 ? "#ffb347" : score >= 40 ? "#3b82f6" : "#ff6b6b";
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
      <div className="mini-score__icon" style={{ background: `${color}15`, color }}>{icon}</div>
      <div className="mini-score__info">
        <span className="mini-score__lbl">{label}</span>
        <span className="mini-score__val" style={{ color }}>{value}%</span>
      </div>
      <div className="mini-score__track">
        <div ref={barRef} className="mini-score__fill" style={{ background: color, width: 0, transition: "width 1s ease 0.3s" }} />
      </div>
    </div>
  );
}

function Dashboard({ data, onReset }) {
  if (!data) return null;
  const { match, score, feedback, questions } = data;

  const handlePrint = () => {
    window.print();
  };

  const barData = {
    labels: ["Skills", "Experience", "Education", "Keywords"],
    datasets: [{
      label: "Score",
      data: [match.skillsScore, match.experienceScore, match.educationScore, match.keywordScore],
      backgroundColor: ["rgba(108,99,255,0.7)", "rgba(0,212,170,0.7)", "rgba(59,130,246,0.7)", "rgba(255,179,71,0.7)"],
      borderColor: ["#6c63ff", "#00d4aa", "#3b82f6", "#ffb347"],
      borderWidth: 2, borderRadius: 8, borderSkipped: false,
    }],
  };

  const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10,10,15,0.9)", padding: 12, cornerRadius: 8,
        borderColor: "rgba(255,255,255,0.1)", borderWidth: 1,
      },
    },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#6b6b80", stepSize: 25 }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: "#a0a0b8" }, border: { display: false } },
    },
  };

  const feedbackLines = (feedback || "").split("\n").filter(Boolean);

  return (
    <section className="dash-section">
      <div className="dash fade-in" id="report-content">
        {/* Header */}
        <div className="dash__hdr">
          <div className="dash__actions">
            <button className="dash__btn" onClick={onReset}><ArrowLeft size={16} /> New Analysis</button>
            <button className="dash__btn dash__btn--primary" onClick={handlePrint}><Download size={16} /> Download PDF</button>
          </div>
          <div className="dash__title-row">
            <div>
              <h1>Analysis Results</h1>
              <div className="dash__domain"><span className="c-accent">Domain:</span> {data.domain || "Software Engineering"}</div>
            </div>
            <span className="dash__ai-badge"><Sparkles size={14} /> AI Report</span>
          </div>
        </div>

        {/* Nudge banner — only shown when no job description was used */}
        {match.generalAnalysis && (
          <div className="dash__nudge">
            <Info size={16} />
            <span>
              These scores reflect your <strong>resume quality</strong>, not a specific job match.
              &nbsp;<button className="dash__nudge-btn" onClick={onReset}>Add a job description</button>&nbsp;
              to get a real match score.
            </span>
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
                <span className="mini-stat__lbl"><FileText size={14} /> Structure</span>
                <div className="mini-stat__bar"><div className="mini-stat__fill" style={{ width: `${match.structureScore}%`, background: "#6c63ff" }}></div></div>
                <span className="mini-stat__val">{match.structureScore}%</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat__lbl"><CheckCircle2 size={14} /> Contact Info</span>
                <div className="mini-stat__bar"><div className="mini-stat__fill" style={{ width: `${match.contactScore}%`, background: "#00d4aa" }}></div></div>
                <span className="mini-stat__val">{match.contactScore}%</span>
              </div>
            </div>

            <div className="dcard__hero-right">
              <div className="dcard__ats">
                <span className="dcard__ats-lbl">ATS Score</span>
                <span className="dcard__ats-val">{score}<span className="dcard__ats-max">/100</span></span>
              </div>
              <div className="dcard__hero-stats">
                <div className="dcard__hstat"><FileText size={16} /> {match.matchingSkills.length} Skills Matched</div>
                <div className="dcard__hstat"><XCircle size={16} /> {match.missingSkills.length} Skills Missing</div>
              </div>
            </div>
          </div>

          {/* Mini scores */}
          <div className="dcard dcard--scores">
            <div className="dcard__label"><BarChart3 size={16} /> Score Breakdown</div>
            <div className="mini-grid">
              <MiniScore icon={<Target size={18}/>} label="Skills Match" value={match.skillsScore} color="#6c63ff" />
              <MiniScore icon={<TrendingUp size={18}/>} label="Experience" value={match.experienceScore} color="#00d4aa" />
              <MiniScore icon={<Award size={18}/>} label="Education" value={match.educationScore} color="#3b82f6" />
              <MiniScore icon={<Zap size={18}/>} label="Keywords" value={match.keywordScore} color="#ffb347" />
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
            <div className="skills-group">
              <div className="skills-hdr"><CheckCircle2 size={16} className="c-green" /> Matching Skills <span className="skills-cnt c-green-bg">{match.matchingSkills.length}</span></div>
              <div className="skills-tags">
                {match.matchingSkills.length > 0
                  ? match.matchingSkills.map((s) => <span key={s} className="stag stag--ok"><CheckCircle2 size={12}/> {s}</span>)
                  : <span className="skills-empty">No matching skills detected</span>}
              </div>
            </div>
            <div className="skills-divider"></div>
            <div className="skills-group">
              <div className="skills-hdr"><XCircle size={16} className="c-red" /> Missing Skills <span className="skills-cnt c-red-bg">{match.missingSkills.length}</span></div>
              <div className="skills-tags">
                {match.missingSkills.length > 0
                  ? match.missingSkills.map((s) => <span key={s} className="stag stag--miss"><XCircle size={12}/> {s}</span>)
                  : <span className="skills-empty skills-empty--ok"><Sparkles size={14}/> Perfect match!</span>}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="dcard dcard--ai">
            <div className="dcard__label dcard__label--ai"><Brain size={16} /> AI Recommendations <span className="ai-pill">Powered by AI</span></div>
            <ul className="ai-list">
              {feedbackLines.map((line, i) => (
                <li key={i} className="ai-item">
                  <div className="ai-bullet"><Sparkles size={12}/></div>
                  <span>{line.replace(/^[•-]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* AI Mock Interview Questions */}
          {questions && questions.length > 0 && (
            <div className="dcard dcard--ai dcard--interview">
              <div className="dcard__label dcard__label--ai"><MessageSquare size={16} /> Mock Interview Prep <span className="ai-pill">Powered by AI</span></div>
              <p className="interview-desc">Practice answering these technical questions tailored to the skills found on your resume:</p>
              <div className="q-list">
                {questions.map((q, i) => (
                  <div key={i} className="q-card">
                    <div className="q-num">Q{i + 1}</div>
                    <div className="q-text">{q}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;

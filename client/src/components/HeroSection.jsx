import { Zap, FileText, Target, Brain, MessageSquare, Wand2, CheckCircle2, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import "./HeroSection.css";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

function HeroSection({ onGetStarted }) {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__container">
          <motion.div className="hero__content" variants={stagger} initial="hidden" animate="show">

            <motion.div variants={fadeUp} className="hero__badge">
              <span className="hero__badge-icon"><Zap size={14} /></span>
              <span className="hero__badge-text">The Ultimate Career AI Suite</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="hero__title">
              Land your dream job with{" "}
              <span className="gradient-text">AI Resume Intelligence</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="hero__subtitle">
              Upload your resume for instant ATS scoring, generate tailored cover letters, rewrite weak bullets, and practice with our AI Mock Interview bot.
            </motion.p>

            <motion.div variants={fadeUp} className="hero__cta-group">
              <button className="hero__btn" onClick={onGetStarted}>
                <FileText size={16} /> Try It For Free <ArrowRight size={16} />
              </button>
              <button
                className="hero__btn hero__btn--ghost"
                onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play size={16} /> See How It Works
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="hero__stats">
              {[
                { value: "4",    label: "AI Tools" },
                { value: "98%",  label: "ATS Accuracy" },
                { value: "< 5s", label: "Analysis Time" },
                { value: "Free", label: "Forever" },
              ].map((s, i) => (
                <div className="hero__stat" key={i}>
                  <span className="hero__stat-val">{s.value}</span>
                  <span className="hero__stat-lbl">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 150, damping: 20 }}
          >
            <div className="hero__card-stack">
              <div className="hero__mock hero__mock--back">
                <div className="mock-skeleton">
                  <div className="ml ml--s" /><div className="ml" /><div className="ml ml--m" />
                  <div className="mock-div" />
                  <div className="ml ml--l" /><div className="ml ml--m" /><div className="ml" />
                </div>
              </div>
              <div className="hero__mock hero__mock--front">
                <div className="mock-hdr">
                  <div className="mock-avatar" />
                  <div className="mock-hdr-lines">
                    <div className="ml ml--m" /><div className="ml ml--s" />
                  </div>
                </div>
                <div className="mock-div" />
                <div className="mock-bars">
                  {[
                    { label: "ATS Match", pct: "92%", cls: "mock-fill--p" },
                    { label: "Experience", pct: "75%", cls: "mock-fill--g" },
                    { label: "Keywords",   pct: "88%", cls: "mock-fill--b" },
                  ].map((r) => (
                    <div className="mock-row" key={r.label}>
                      <span>{r.label}</span>
                      <div className="mock-bar"><div className={`mock-fill ${r.cls}`} style={{ width: r.pct }} /></div>
                    </div>
                  ))}
                </div>
                <div className="mock-badge">
                  <span className="mock-badge-val">92</span>
                  <span className="mock-badge-lbl">Score</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="section features" id="tools">
        <div className="section__container">
          <div className="section__hdr">
            <h2 className="section__title">
              Everything you need to <span className="gradient-text">optimize your career</span>
            </h2>
            <p className="section__subtitle">
              A complete suite of AI tools — from ATS scoring to interview prep — all in one place.
            </p>
          </div>

          <div className="features-grid">
            {/* ATS Scoring — wide */}
            <div className="feature-card feature-card--wide">
              <div className="feature-card__body">
                <div className="feature-card__icon" style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa" }}>
                  <Brain size={24} />
                </div>
                <h3 className="feature-card__title">Intelligent ATS Scoring</h3>
                <p className="feature-card__desc">
                  Upload your resume and a job description. Our AI matches it against enterprise ATS systems and gives a granular score across keywords, experience, and formatting.
                </p>
                <ul className="feature-card__list">
                  <li><CheckCircle2 size={14} /> Instant match percentage</li>
                  <li><CheckCircle2 size={14} /> Missing keywords analysis</li>
                  <li><CheckCircle2 size={14} /> Actionable feedback</li>
                </ul>
              </div>
              <div className="feature-card__demo">
                <div className="demo-box">
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Live Preview</span>
                  {[
                    { label: "ATS Match",  pct: "92%", color: "var(--accent-primary)" },
                    { label: "Skills",     pct: "85%", color: "var(--accent-green)" },
                    { label: "Keywords",   pct: "78%", color: "var(--accent-blue)" },
                  ].map((r) => (
                    <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                        <span>{r.label}</span><span style={{ color: r.color }}>{r.pct}</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: r.pct, height: "100%", background: r.color, borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="feature-card">
              <div className="feature-card__icon" style={{ background: "rgba(16,185,129,0.12)", color: "var(--accent-green)" }}>
                <FileText size={24} />
              </div>
              <h3 className="feature-card__title">AI Cover Letters</h3>
              <p className="feature-card__desc">
                Stop writing from scratch. Generate a highly personalized, compelling cover letter tailored to any job role using your exact resume history.
              </p>
            </div>

            {/* Mock Interviews */}
            <div className="feature-card">
              <div className="feature-card__icon" style={{ background: "rgba(59,130,246,0.12)", color: "var(--accent-blue)" }}>
                <MessageSquare size={24} />
              </div>
              <h3 className="feature-card__title">Mock Interviews</h3>
              <p className="feature-card__desc">
                Chat with our TechRecruit AI bot. Practice answering behavioral and technical questions based on your resume before the real thing.
              </p>
            </div>

            {/* Bullet Rewriter — wide */}
            <div className="feature-card feature-card--wide">
              <div className="feature-card__body">
                <div className="feature-card__icon" style={{ background: "rgba(249,115,22,0.12)", color: "var(--accent-orange)" }}>
                  <Wand2 size={24} />
                </div>
                <h3 className="feature-card__title">STAR Bullet Rewriter</h3>
                <p className="feature-card__desc">
                  Paste weak resume bullets and let our AI rewrite them using the proven STAR (Situation, Task, Action, Result) method, tailored to your target job.
                </p>
              </div>
              <div className="feature-card__demo">
                <div className="demo-box">
                  <div className="demo-before">&ldquo;Did the marketing campaign&rdquo;</div>
                  <div className="demo-after">&ldquo;Spearheaded a Q3 marketing campaign resulting in a 34% increase in user acquisition and $1.2M in pipeline generation.&rdquo;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="section how-it-works" id="how-it-works">
        <div className="section__container">
          <div className="section__hdr">
            <h2 className="section__title">How it <span className="gradient-text">works</span></h2>
            <p className="section__subtitle">Get actionable insights and tailored documents in three simple steps.</p>
          </div>

          <div className="steps">
            {[
              { n: "01", title: "Upload Resume",    desc: "Upload your existing resume as a PDF document.",                                      icon: <FileText size={22} /> },
              { n: "02", title: "Add Description",  desc: "Paste the target job description you're applying for.",                               icon: <Target size={22} /> },
              { n: "03", title: "Unlock Tools",     desc: "Get your ATS score, generate a cover letter, and start interview prep.",              icon: <Zap size={22} /> },
            ].map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-card__num">{s.n}</div>
                <div className="step-card__icon-wrap">{s.icon}</div>
                <h3 className="step-card__title">{s.title}</h3>
                <p className="step-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="section__cta">
            <button className="hero__btn" onClick={onGetStarted}>
              <Zap size={16} /> Start Optimizing Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;

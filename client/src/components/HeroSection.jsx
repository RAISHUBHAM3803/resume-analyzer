import { Zap, BarChart3, FileText, Target, Brain, Shield, ArrowRight } from "lucide-react";
import "./HeroSection.css";

function HeroSection({ onGetStarted }) {
  return (
    <>
      <section className="hero">
        <div className="hero__container">
          <div className="hero__content fade-in-up">
            <div className="hero__badge">
              <span className="hero__badge-icon"><Zap size={14} /></span>
              <span className="hero__badge-text">AI-Powered Resume Intelligence</span>
            </div>

            <h1 className="hero__title">
              Land your dream job with <span className="gradient-text">AI Resume Analysis</span>
            </h1>

            <p className="hero__subtitle">
              Upload your resume, paste a job description, and get instant AI-powered
              insights with ATS scoring, skills mapping, and personalized recommendations.
            </p>

            <div className="hero__cta-group">
              <button className="hero__btn" onClick={onGetStarted}>
                <FileText size={18} />
                Analyze My Resume
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="hero__stats">
              {[
                { value: "98%", label: "Accuracy" },
                { value: "50+", label: "Skills Tracked" },
                { value: "< 5s", label: "Analysis Time" },
                { value: "Free", label: "Forever" },
              ].map((s, i) => (
                <div className="hero__stat" key={i}>
                  <span className="hero__stat-val">{s.value}</span>
                  <span className="hero__stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero__visual fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="hero__card-stack">
              <div className="hero__mock hero__mock--back">
                <div className="mock-skeleton">
                  <div className="ml ml--s"></div>
                  <div className="ml"></div>
                  <div className="ml ml--m"></div>
                  <div className="mock-div"></div>
                  <div className="ml ml--l"></div>
                  <div className="ml ml--m"></div>
                  <div className="ml"></div>
                </div>
              </div>
              <div className="hero__mock hero__mock--front">
                <div className="mock-hdr">
                  <div className="mock-avatar"></div>
                  <div className="mock-hdr-lines">
                    <div className="ml ml--m"></div>
                    <div className="ml ml--s"></div>
                  </div>
                </div>
                <div className="mock-div"></div>
                <div className="mock-bars">
                  <div className="mock-row">
                    <span>ATS Match</span>
                    <div className="mock-bar"><div className="mock-fill mock-fill--p" style={{ width: "92%" }}></div></div>
                  </div>
                  <div className="mock-row">
                    <span>Experience</span>
                    <div className="mock-bar"><div className="mock-fill mock-fill--g" style={{ width: "75%" }}></div></div>
                  </div>
                  <div className="mock-row">
                    <span>Keywords</span>
                    <div className="mock-bar"><div className="mock-fill mock-fill--b" style={{ width: "88%" }}></div></div>
                  </div>
                </div>
                <div className="mock-badge">
                  <span className="mock-badge-val">92</span>
                  <span className="mock-badge-lbl">Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features" id="features">
        <div className="section__container">
          <div className="section__hdr fade-in-up">
            <h2 className="section__title">Everything you need to <span className="gradient-text">optimize your resume</span></h2>
            <p className="section__subtitle">Stop guessing what recruiters want. Our AI analyzes your resume exactly like modern ATS software does.</p>
          </div>
          
          <div className="features__grid">
            {[
              { icon: <Brain size={24} />, title: "AI-Powered Analysis", desc: "Advanced algorithms parse and evaluate your resume against industry standards.", color: "var(--accent-secondary)" },
              { icon: <Target size={24} />, title: "Job Matching", desc: "Compare your resume against any job description for targeted optimization.", color: "var(--accent-green)" },
              { icon: <BarChart3 size={24} />, title: "Detailed Scoring", desc: "Get granular breakdowns across skills, experience, education & keywords.", color: "var(--accent-blue)" },
              { icon: <Shield size={24} />, title: "ATS Compatibility", desc: "Ensure your resume passes Applicant Tracking Systems with confidence.", color: "var(--accent-orange)" },
            ].map((f, i) => (
              <div className="feature-card fade-in-up" style={{ animationDelay: `${0.1 * (i + 1)}s` }} key={i}>
                <div className="feature-card__icon" style={{ color: f.color }}>
                  {f.icon}
                  <div className="feature-card__icon-glow" style={{ background: f.color }}></div>
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works" id="how-it-works">
        <div className="section__container">
          <div className="section__hdr fade-in-up">
            <h2 className="section__title">How it <span className="gradient-text">works</span></h2>
            <p className="section__subtitle">Get actionable insights in three simple steps.</p>
          </div>
          
          <div className="steps">
            {[
              { n: "01", title: "Upload Resume", desc: "Upload your existing resume as a PDF document.", icon: <FileText size={28} /> },
              { n: "02", title: "Add Description", desc: "Paste the target job description you're applying for.", icon: <Target size={28} /> },
              { n: "03", title: "Get Insights", desc: "Review detailed scores and AI recommendations.", icon: <Brain size={28} /> },
            ].map((s, i) => (
              <div className="step-card fade-in-up" style={{ animationDelay: `${0.1 * (i + 1)}s` }} key={i}>
                <div className="step-card__num">{s.n}</div>
                <div className="step-card__icon-wrap">
                  <div className="step-card__icon">{s.icon}</div>
                </div>
                <h3 className="step-card__title">{s.title}</h3>
                <p className="step-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="section__cta fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button className="hero__btn" onClick={onGetStarted}>
              <Zap size={18} /> Start Analyzing Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;

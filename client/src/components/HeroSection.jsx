import { Zap, BarChart3, FileText, Target, Brain, Shield, ArrowRight } from "lucide-react";
import "./HeroSection.css";

function HeroSection({ onGetStarted }) {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content fade-in">
          <div className="hero__badge">
            <Zap size={14} />
            <span>AI-Powered Resume Intelligence</span>
          </div>

          <h1 className="hero__title">
            Land Your Dream Job with <span className="gradient-text">AI Resume Analysis</span>
          </h1>

          <p className="hero__subtitle">
            Upload your resume, paste a job description, and get instant AI-powered
            insights with ATS scoring, skills mapping, and personalized recommendations.
          </p>

          <button className="hero__btn" onClick={onGetStarted}>
            <FileText size={18} />
            Analyze My Resume
            <ArrowRight size={18} />
          </button>

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

        <div className="hero__visual fade-in-delay">
          <div className="hero__card-stack">
            <div className="hero__mock hero__mock--back">
              <div className="ml ml--s"></div>
              <div className="ml"></div>
              <div className="ml ml--m"></div>
            </div>
            <div className="hero__mock hero__mock--front">
              <div className="mock-hdr">
                <div className="mock-avatar"></div>
                <div className="mock-hdr-lines"><div className="ml ml--s"></div><div className="ml ml--xs"></div></div>
              </div>
              <div className="mock-div"></div>
              <div className="mock-bars">
                <div className="mock-row"><span>Skills</span><div className="mock-bar"><div className="mock-fill" style={{width:"85%"}}></div></div></div>
                <div className="mock-row"><span>Experience</span><div className="mock-bar"><div className="mock-fill mock-fill--g" style={{width:"72%"}}></div></div></div>
                <div className="mock-row"><span>Keywords</span><div className="mock-bar"><div className="mock-fill mock-fill--b" style={{width:"90%"}}></div></div></div>
              </div>
              <div className="mock-badge">92</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="hero__features" id="features">
        <div className="hero__wrap">
          <h2 className="hero__sec-title">Everything you need to <span className="gradient-text">optimize your resume</span></h2>
          <div className="hero__fgrid">
            {[
              { icon: <Brain size={24}/>, title: "AI-Powered Analysis", desc: "Advanced algorithms parse and evaluate your resume against industry standards.", color: "#6c63ff" },
              { icon: <Target size={24}/>, title: "Job Matching", desc: "Compare your resume against any job description for targeted optimization.", color: "#00d4aa" },
              { icon: <BarChart3 size={24}/>, title: "Detailed Scoring", desc: "Get granular breakdowns across skills, experience, education & keywords.", color: "#3b82f6" },
              { icon: <Shield size={24}/>, title: "ATS Compatibility", desc: "Ensure your resume passes Applicant Tracking Systems with confidence.", color: "#ffb347" },
            ].map((f, i) => (
              <div className="fcard" key={i}>
                <div className="fcard__icon" style={{background:`${f.color}15`, color:f.color}}>{f.icon}</div>
                <h3 className="fcard__title">{f.title}</h3>
                <p className="fcard__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="hero__how" id="how-it-works">
        <div className="hero__wrap">
          <h2 className="hero__sec-title">How it <span className="gradient-text">works</span></h2>
          <div className="hero__steps">
            {[
              { n: "01", title: "Upload Resume", desc: "Upload your resume as a PDF document", icon: <FileText size={28}/> },
              { n: "02", title: "Add Job Description", desc: "Paste the target job description for matching", icon: <Target size={28}/> },
              { n: "03", title: "Get AI Insights", desc: "Receive detailed scores and recommendations", icon: <Brain size={28}/> },
            ].map((s, i) => (
              <div className="scard" key={i}>
                <div className="scard__num">{s.n}</div>
                <div className="scard__icon">{s.icon}</div>
                <h3 className="scard__title">{s.title}</h3>
                <p className="scard__desc">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="hero__bottom-cta">
            <button className="hero__btn" onClick={onGetStarted}>
              <Zap size={18} /> Start Analyzing Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

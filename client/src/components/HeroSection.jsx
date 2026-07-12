import { Zap, BarChart3, FileText, Target, Brain, Shield, ArrowRight, MessageSquare, Wand2, CheckCircle2, ChevronRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import "./HeroSection.css";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function HeroSection({ onGetStarted }) {
  return (
    <>
      <section className="hero">
        <div className="hero__container">
          <motion.div 
            className="hero__content"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemAnim} className="hero__badge">
              <span className="hero__badge-icon"><Zap size={14} /></span>
              <span className="hero__badge-text">The Ultimate Career AI Suite</span>
            </motion.div>

            <motion.h1 variants={itemAnim} className="hero__title">
              Land your dream job with <span className="gradient-text">AI Resume Intelligence</span>
            </motion.h1>

            <motion.p variants={itemAnim} className="hero__subtitle">
              Upload your resume to get instant ATS scoring, generate perfectly tailored cover letters, rewrite weak bullets, and practice with our AI Mock Interview bot.
            </motion.p>

            <motion.div variants={itemAnim} className="hero__cta-group">
              <button className="hero__btn" onClick={onGetStarted}>
                <FileText size={18} />
                Try It For Free
                <ArrowRight size={18} />
              </button>
              <button className="hero__btn hero__btn--ghost" onClick={() => document.getElementById('tools').scrollIntoView({ behavior: 'smooth' })}>
                <Play size={18} /> See How it Works
              </button>
            </motion.div>

            <motion.div variants={itemAnim} className="hero__stats">
              {[
                { value: "4", label: "Powerful AI Tools" },
                { value: "98%", label: "ATS Accuracy" },
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 100 }}
          >
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
          </motion.div>
        </div>
      </section>

      {/* AI Tools Bento Grid */}
      <section className="section features" id="tools">
        <div className="section__container">
          <div className="section__hdr fade-in-up">
            <h2 className="section__title">Everything you need to <span className="gradient-text">optimize your career</span></h2>
            <p className="section__subtitle">We go beyond simple keyword matching. ResuScan provides an entire suite of tools from application to interview.</p>
          </div>
          
          <div className="bento-layout">
            <div className="bento-box bento-large fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="bento-content">
                <div className="bento-icon" style={{ color: 'var(--accent-secondary)' }}>
                  <Brain size={28} />
                  <div className="bento-glow" style={{ background: 'var(--accent-secondary)' }}></div>
                </div>
                <h3>Intelligent ATS Scoring</h3>
                <p>Upload your resume and a job description. Our AI analyzes your document exactly like enterprise Applicant Tracking Systems do, providing a granular score across keywords, experience, and formatting.</p>
                <ul className="bento-list">
                  <li><CheckCircle2 size={16}/> Instant match percentage</li>
                  <li><CheckCircle2 size={16}/> Missing keywords analysis</li>
                  <li><CheckCircle2 size={16}/> Actionable feedback</li>
                </ul>
              </div>
            </div>

            <div className="bento-box fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bento-content">
                <div className="bento-icon" style={{ color: 'var(--accent-green)' }}>
                  <FileText size={28} />
                  <div className="bento-glow" style={{ background: 'var(--accent-green)' }}></div>
                </div>
                <h3>AI Cover Letters</h3>
                <p>Stop writing from scratch. We instantly generate a highly personalized, compelling cover letter tailored specifically to the target role using your exact resume history.</p>
              </div>
            </div>

            <div className="bento-box fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="bento-content">
                <div className="bento-icon" style={{ color: 'var(--accent-blue)' }}>
                  <MessageSquare size={28} />
                  <div className="bento-glow" style={{ background: 'var(--accent-blue)' }}></div>
                </div>
                <h3>Mock Interviews</h3>
                <p>Chat with our TechRecruit AI bot. Practice answering behavioral and technical questions based on your resume before the real thing.</p>
              </div>
            </div>

            <div className="bento-box bento-wide fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="bento-content bento-horizontal">
                <div>
                  <div className="bento-icon" style={{ color: 'var(--accent-orange)' }}>
                    <Wand2 size={28} />
                    <div className="bento-glow" style={{ background: 'var(--accent-orange)' }}></div>
                  </div>
                  <h3>STAR Bullet Rewriter</h3>
                  <p>Paste your weak resume bullets and let our AI rewrite them using the proven STAR (Situation, Task, Action, Result) method.</p>
                </div>
                <div className="bento-demo">
                  <div className="demo-before">"Did the marketing campaign"</div>
                  <ChevronRight className="demo-arrow" size={20} />
                  <div className="demo-after">"Spearheaded a Q3 marketing campaign resulting in a 34% increase in user acquisition and $1.2M in pipeline generation."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works" id="how-it-works">
        <div className="section__container">
          <div className="section__hdr fade-in-up">
            <h2 className="section__title">How it <span className="gradient-text">works</span></h2>
            <p className="section__subtitle">Get actionable insights and tailored documents in three simple steps.</p>
          </div>
          
          <div className="steps">
            {[
              { n: "01", title: "Upload Resume", desc: "Upload your existing resume as a PDF document.", icon: <FileText size={28} /> },
              { n: "02", title: "Add Description", desc: "Paste the target job description you're applying for.", icon: <Target size={28} /> },
              { n: "03", title: "Unlock Tools", desc: "Get your ATS score, generate a cover letter, and start interview prep.", icon: <Zap size={28} /> },
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
              <Zap size={18} /> Start Optimizing Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;

import { ScanSearch, Heart, ExternalLink } from "lucide-react";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">

        {/* ── Top divider line ── */}
        <div className="footer__top">

          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon"><ScanSearch size={16} /></div>
              <span className="footer__logo-text">
                Resu<span className="gradient-text">Scan</span>
              </span>
              <span className="footer__badge">AI</span>
            </div>
            <p className="footer__tagline">
              AI-powered resume analysis. Get your ATS score, skill gaps, and actionable improvements in seconds.
            </p>
          </div>

          {/* Navigation links — only real pages */}
          <nav className="footer__nav" aria-label="Footer navigation">
            <div className="footer__nav-col">
              <h4 className="footer__nav-title">Navigate</h4>
              <ul className="footer__nav-list">
                <li><a href="#features" className="footer__nav-link">Features</a></li>
                <li><a href="#how-it-works" className="footer__nav-link">How it Works</a></li>
              </ul>
            </div>

            <div className="footer__nav-col">
              <h4 className="footer__nav-title">Project</h4>
              <ul className="footer__nav-list">
                <li>
                  <a
                    href="https://github.com/RAISHUBHAM3803/resume-analyzer"
                    className="footer__nav-link footer__nav-link--ext"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>
          </nav>

        </div>

        {/* ── Bottom bar ── */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} ResuScan AI. Built with{" "}
            <Heart size={13} className="footer__heart" />{" "}
            by Shubham Rai.
          </p>
          <p className="footer__stack">
            React · Node.js · MongoDB · Groq AI
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;

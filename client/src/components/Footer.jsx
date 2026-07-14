import { ScanSearch, ExternalLink, GitBranch, Link2 } from "lucide-react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon"><ScanSearch size={18} /></div>
              <span className="footer__logo-text">Resu<span className="gradient-text">Scan</span></span>
              <span className="footer__badge">AI</span>
            </div>
            <p className="footer__tagline">
              Practice smarter. Optimize faster. Land your dream job. The premium platform built for job seekers who take their careers seriously.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="GitHub"><GitBranch size={16} /></a>
              <a href="#" className="footer__social-link" aria-label="Portfolio"><Link2 size={16} /></a>
            </div>
          </div>

          <div className="footer__nav">
            <div className="footer__nav-col">
              <h4 className="footer__nav-title">PLATFORM</h4>
              <ul className="footer__nav-list">
                <li><a href="#" className="footer__nav-link">Home</a></li>
                <li><a href="#tools" className="footer__nav-link">AI Tools</a></li>
                <li><a href="#how-it-works" className="footer__nav-link">How it Works</a></li>
                <li><a href="/dashboard" className="footer__nav-link">Dashboard</a></li>
              </ul>
            </div>
            
            <div className="footer__nav-col">
              <h4 className="footer__nav-title">LEGAL</h4>
              <ul className="footer__nav-list">
                <li><a href="#" className="footer__nav-link">Privacy Policy</a></li>
                <li><a href="#" className="footer__nav-link">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            &copy; {currentYear} ResuScan AI. All rights reserved.
          </div>
          <div className="footer__made-with">
            Crafted by <a href="#" className="footer__author-link">Shubham Rai <ExternalLink size={10} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

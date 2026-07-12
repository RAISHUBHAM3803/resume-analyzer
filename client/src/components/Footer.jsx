import { ScanSearch, Heart, ExternalLink, Mail, MessageCircle, Globe } from "lucide-react";
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
              <span className="footer__logo-text">ResuScan</span>
              <span className="footer__badge">AI</span>
            </div>
            <p className="footer__tagline">
              The ultimate AI career suite. Analyze your resume, generate perfect cover letters, and master your next interview with our TechRecruit bot.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="Website"><Globe size={18} /></a>
              <a href="#" className="footer__social-link" aria-label="Community"><MessageCircle size={18} /></a>
              <a href="#" className="footer__social-link" aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>

          <div className="footer__nav">
            <div className="footer__nav-col">
              <h4 className="footer__nav-title">AI Tools</h4>
              <ul className="footer__nav-list">
                <li><a href="#" className="footer__nav-link">Resume Scoring</a></li>
                <li><a href="#" className="footer__nav-link">Cover Letter Generator</a></li>
                <li><a href="#" className="footer__nav-link">Mock Interviews</a></li>
                <li><a href="#" className="footer__nav-link">STAR Bullet Rewriter</a></li>
              </ul>
            </div>
            
            <div className="footer__nav-col">
              <h4 className="footer__nav-title">Resources</h4>
              <ul className="footer__nav-list">
                <li><a href="#" className="footer__nav-link">ATS Resume Guide</a></li>
                <li><a href="#" className="footer__nav-link">Interview Prep Tips</a></li>
                <li><a href="#" className="footer__nav-link">Blog</a></li>
                <li><a href="#" className="footer__nav-link">Help Center</a></li>
              </ul>
            </div>
            
            <div className="footer__nav-col">
              <h4 className="footer__nav-title">Company</h4>
              <ul className="footer__nav-list">
                <li><a href="#" className="footer__nav-link">About Us</a></li>
                <li><a href="#" className="footer__nav-link">Privacy Policy</a></li>
                <li><a href="#" className="footer__nav-link">Terms of Service</a></li>
                <li><a href="#" className="footer__nav-link">Contact <ExternalLink size={12} /></a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            &copy; {currentYear} ResuScan AI. All rights reserved.
          </div>
          <div className="footer__made-with">
            Built with <Heart size={12} className="footer__heart" /> for job seekers everywhere.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

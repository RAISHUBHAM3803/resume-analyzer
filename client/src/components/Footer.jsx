import { Sparkles, Heart, Github, Twitter, Linkedin } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          
          <div className="footer__brand-col">
            <div className="footer__logo">
              <div className="footer__logo-icon"><Sparkles size={16}/></div>
              <span className="footer__logo-text">Resu<span className="gradient-text">Scan</span></span>
              <span className="footer__badge">AI</span>
            </div>
            <p className="footer__tagline">
              Advanced AI-powered resume analysis for landing your dream job faster.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="footer__social" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="footer__social" aria-label="GitHub">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div className="footer__links-grid">
            <div className="footer__col">
              <h4 className="footer__col-title">Product</h4>
              <ul className="footer__link-list">
                <li><a href="#features" className="footer__link">Features</a></li>
                <li><a href="#how-it-works" className="footer__link">How it Works</a></li>
                <li><a href="#" className="footer__link">Pricing</a></li>
                <li><a href="#" className="footer__link">Changelog</a></li>
              </ul>
            </div>
            
            <div className="footer__col">
              <h4 className="footer__col-title">Resources</h4>
              <ul className="footer__link-list">
                <li><a href="#" className="footer__link">Documentation</a></li>
                <li><a href="#" className="footer__link">Resume Tips</a></li>
                <li><a href="#" className="footer__link">Blog</a></li>
                <li><a href="#" className="footer__link">Support</a></li>
              </ul>
            </div>
            
            <div className="footer__col">
              <h4 className="footer__col-title">Legal</h4>
              <ul className="footer__link-list">
                <li><a href="#" className="footer__link">Privacy Policy</a></li>
                <li><a href="#" className="footer__link">Terms of Service</a></li>
                <li><a href="#" className="footer__link">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
        </div>
        
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} ResuScan AI. All rights reserved.
          </p>
          <p className="footer__made-with">
            Made with <Heart size={14} className="footer__heart" /> for job seekers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

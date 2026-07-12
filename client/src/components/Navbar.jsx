import { useState, useEffect } from "react";
import { ScanSearch, Menu, X, LogIn, LogOut, History, User, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

function Navbar({ onLogoClick, onGetStarted, onHistoryClick, user, onLogout, onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <motion.nav 
        className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="navbar__inner">
          <button className="navbar__logo" onClick={onLogoClick} aria-label="Home">
            <div className="navbar__logo-icon"><ScanSearch size={18} /></div>
            <span className="navbar__logo-text">Resu<span className="gradient-text">Scan</span></span>
            <span className="navbar__badge">AI</span>
          </button>

          <div className="navbar__links">
            {!user && (
              <>
                <a href="#features" className="navbar__link">Features</a>
                <a href="#tools" className="navbar__link">AI Tools</a>
                <a href="#how-it-works" className="navbar__link">How it Works</a>
              </>
            )}
            
            {user ? (
              <div className="navbar__user-menu">
                <button className="navbar__link navbar__link--btn" onClick={onHistoryClick}>
                  <History size={16} /> History
                </button>
                <div className="navbar__avatar" title={user.name}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button className="navbar__link navbar__link--btn navbar__link--danger" onClick={onLogout} title="Logout">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <button className="navbar__link navbar__link--btn" onClick={onLoginClick}>
                <LogIn size={16} /> Sign in
              </button>
            )}
            
            <button className="navbar__cta" onClick={onGetStarted}>
              <Sparkles size={16} />
              {user ? "Dashboard" : "Get Started"}
            </button>
          </div>

          <button 
            className="navbar__toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="navbar__mobile-overlay navbar__mobile-overlay--open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="navbar__mobile-content"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="navbar__mobile-header">
                <button className="navbar__logo" onClick={() => { onLogoClick(); setMenuOpen(false); }}>
                  <div className="navbar__logo-icon"><ScanSearch size={18} /></div>
                  <span className="navbar__logo-text">Resu<span className="gradient-text">Scan</span></span>
                </button>
                <button className="navbar__mobile-close" onClick={() => setMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="navbar__mobile-links">
                {user && (
                  <div className="navbar__mobile-user">
                    <div className="navbar__avatar navbar__avatar--lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="navbar__mobile-user-info">
                      <span className="navbar__mobile-user-name">{user.name}</span>
                      <span className="navbar__mobile-user-email">{user.email}</span>
                    </div>
                  </div>
                )}
                
                {!user && (
                  <>
                    <a href="#features" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Features</a>
                    <a href="#tools" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>AI Tools</a>
                    <a href="#how-it-works" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>How it Works</a>
                  </>
                )}
                
                {user && (
                  <button className="navbar__mobile-link navbar__mobile-link--btn" onClick={() => { onHistoryClick(); setMenuOpen(false); }}>
                    <History size={18} /> History
                  </button>
                )}
                
                {user ? (
                  <button className="navbar__mobile-link navbar__mobile-link--btn navbar__mobile-link--danger" onClick={() => { onLogout(); setMenuOpen(false); }}>
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <button className="navbar__mobile-link navbar__mobile-link--btn" onClick={() => { onLoginClick(); setMenuOpen(false); }}>
                    <LogIn size={18} /> Sign in
                  </button>
                )}
              </div>
              
              <div className="navbar__mobile-footer">
                <button className="navbar__cta navbar__cta--full" onClick={() => { onGetStarted(); setMenuOpen(false); }}>
                  {user ? "Dashboard" : "Get Started"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;

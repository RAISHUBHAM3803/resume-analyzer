import React, { useState, useEffect } from "react";
import { Sparkles, Menu, X, History, LogIn, LogOut } from "lucide-react";
import "./Navbar.css";

function Navbar({ onLogoClick, onGetStarted, onHistoryClick, user, onLogout, onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <button className="navbar__logo" onClick={onLogoClick}>
          <div className="navbar__logo-icon"><Sparkles size={18} /></div>
          <span className="navbar__logo-text">Resu<span className="gradient-text">Scan</span></span>
          <span className="navbar__badge">AI</span>
        </button>

        <div className="navbar__links">
          <a href="#features" className="navbar__link">Features</a>
          {user && <button className="navbar__link navbar__link--btn" onClick={onHistoryClick}>History</button>}
          {user ? (
            <button className="navbar__link navbar__link--btn" onClick={onLogout}><LogOut size={16} style={{marginRight: '6px', verticalAlign: 'text-bottom'}} /> Logout</button>
          ) : (
            <button className="navbar__link navbar__link--btn" onClick={onLoginClick}><LogIn size={16} style={{marginRight: '6px', verticalAlign: 'text-bottom'}} /> Login</button>
          )}
          <button className="navbar__cta" onClick={onGetStarted}>Get Started</button>
        </div>

        <button className="navbar__toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="navbar__mobile">
          <a href="#features" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Features</a>
          {user && <button className="navbar__mobile-link navbar__link--btn" onClick={() => { onHistoryClick(); setMenuOpen(false); }}>History</button>}
          {user ? (
            <button className="navbar__mobile-link navbar__link--btn" onClick={() => { onLogout(); setMenuOpen(false); }}>Logout</button>
          ) : (
            <button className="navbar__mobile-link navbar__link--btn" onClick={() => { onLoginClick(); setMenuOpen(false); }}>Login</button>
          )}
          <button className="navbar__cta" onClick={() => { onGetStarted(); setMenuOpen(false); }}>Get Started</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

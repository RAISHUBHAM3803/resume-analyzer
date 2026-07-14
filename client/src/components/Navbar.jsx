import { useState, useEffect } from "react";
import { ScanSearch, Menu, X, LogIn, LogOut, History, LayoutDashboard, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

function Navbar({ onLogoClick, onGetStarted, onHistoryClick, user, onLogout, onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="navbar__inner">
          {/* Logo */}
          <button className="navbar__logo" onClick={onLogoClick} aria-label="Home">
            <div className="navbar__logo-icon"><ScanSearch size={18} /></div>
            <span className="navbar__logo-text">Resu<span className="gradient-text">Scan</span></span>
            <span className="navbar__badge">AI</span>
          </button>

          {/* Desktop Nav */}
          <div className="navbar__center">
            {!user && (
              <>
                <button className="navbar__link" onClick={() => scrollTo("tools")}>AI Tools</button>
                <button className="navbar__link" onClick={() => scrollTo("how-it-works")}>How it Works</button>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="navbar__actions">
            {user ? (
              <>
                <button className="navbar__action-btn" onClick={onHistoryClick}>
                  <History size={16} />
                  <span>History</span>
                </button>
                <div className="navbar__divider" />
                <div className="navbar__avatar" title={user.name}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button className="navbar__action-btn navbar__action-btn--muted" onClick={onLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
                <button className="navbar__cta" onClick={onGetStarted}>
                  <LayoutDashboard size={15} /> Dashboard
                </button>
              </>
            ) : (
              <>
                <button className="navbar__action-btn navbar__action-btn--muted" onClick={onLoginClick}>
                  Log in
                </button>
                <button className="navbar__cta" onClick={onGetStarted}>
                  <Sparkles size={15} /> Get Started
                </button>
              </>
            )}

            {/* Mobile toggle */}
            <button className="navbar__toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="navbar__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="navbar__drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
            >
              {/* Drawer Header */}
              <div className="drawer__hdr">
                <button className="navbar__logo" onClick={() => { onLogoClick(); setMenuOpen(false); }}>
                  <div className="navbar__logo-icon"><ScanSearch size={16} /></div>
                  <span className="navbar__logo-text">Resu<span className="gradient-text">Scan</span></span>
                </button>
                <button className="drawer__close" onClick={() => setMenuOpen(false)}><X size={20} /></button>
              </div>

              {/* User info (if logged in) */}
              {user && (
                <div className="drawer__user">
                  <div className="navbar__avatar navbar__avatar--lg">{user.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="drawer__user-name">{user.name}</div>
                    <div className="drawer__user-email">{user.email}</div>
                  </div>
                </div>
              )}

              {/* Drawer Links */}
              <nav className="drawer__nav">
                {!user && (
                  <>
                    <button className="drawer__link" onClick={() => scrollTo("tools")}>AI Tools</button>
                    <button className="drawer__link" onClick={() => scrollTo("how-it-works")}>How it Works</button>
                  </>
                )}
                {user && (
                  <>
                    <button className="drawer__link" onClick={() => { onGetStarted(); setMenuOpen(false); }}>
                      <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button className="drawer__link" onClick={() => { onHistoryClick(); setMenuOpen(false); }}>
                      <History size={18} /> History
                    </button>
                  </>
                )}
              </nav>

              {/* Drawer Footer */}
              <div className="drawer__footer">
                {user ? (
                  <button className="drawer__cta drawer__cta--ghost" onClick={() => { onLogout(); setMenuOpen(false); }}>
                    <LogOut size={16} /> Sign Out
                  </button>
                ) : (
                  <>
                    <button className="drawer__cta drawer__cta--ghost" onClick={() => { onLoginClick(); setMenuOpen(false); }}>
                      <LogIn size={16} /> Log in
                    </button>
                    <button className="drawer__cta" onClick={() => { onGetStarted(); setMenuOpen(false); }}>
                      <Sparkles size={15} /> Get Started Free
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;

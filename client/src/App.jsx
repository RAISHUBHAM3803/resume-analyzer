import React, { useState, useEffect, useLayoutEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import UploadForm from "./components/UploadForm";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import Auth from "./components/Auth";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [view, setView] = useState("home");
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simple check: if token exists, we consider user logged in for UI purposes.
    // In a real app, you'd fetch the /me endpoint to validate token.
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  // Scroll to top whenever the view changes (before paint)
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const goHome = () => { setView("home"); setResult(null); };
  const goUpload = () => { 
    if (!user) { setView("auth"); } 
    else { setView("upload"); setResult(null); }
  };
  const goHistory = () => { 
    if (!user) { setView("auth"); } 
    else { setView("history"); setResult(null); }
  };
  const goAuth = () => { setView("auth"); };
  const showResults = (data) => { setResult(data); setView("dashboard"); };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setView("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setView("home");
  };

  return (
    <div className="app">
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {view !== "auth" && (
        <Navbar 
          onLogoClick={goHome} 
          onGetStarted={goUpload} 
          onHistoryClick={goHistory} 
          user={user} 
          onLogout={handleLogout} 
          onLoginClick={goAuth} 
        />
      )}

      <main className="main-content">
        {view === "home" && <HeroSection onGetStarted={goUpload} />}
        {view === "auth" && <Auth onAuthSuccess={handleAuthSuccess} goHome={goHome} />}
        {view === "upload" && <UploadForm onResult={showResults} onBack={goHome} />}
        {view === "dashboard" && result && <Dashboard data={result} onReset={goHome} />}
        {view === "history" && <History onBack={goHome} />}
      </main>

      <Footer />
    </div>
  );
}

export default App;

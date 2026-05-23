import React, { useState, useEffect, useLayoutEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import { getMe } from "./services/api";
import "./App.css";

const UploadForm = lazy(() => import("./components/UploadForm"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const History = lazy(() => import("./components/History"));
const Auth = lazy(() => import("./components/Auth"));

function App() {
  const [view, setView] = useState("home");
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getMe();
          setUser({ ...res.data, token });
        } catch (err) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    };
    checkAuth();
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
        <Suspense fallback={
          <div className="app-loader">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        }>
          {view === "home" && <HeroSection onGetStarted={goUpload} />}
          {view === "auth" && <Auth onAuthSuccess={handleAuthSuccess} goHome={goHome} />}
          {view === "upload" && <UploadForm onResult={showResults} onBack={goHome} />}
          {view === "dashboard" && result && <Dashboard data={result} onReset={goHome} />}
          {view === "history" && <History onBack={goHome} />}
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;

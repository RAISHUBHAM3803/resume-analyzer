import React, { useState } from "react";
import { login, register } from "../services/api";
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import "./Auth.css";

function Auth({ onAuthSuccess, goHome }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res;
      if (isLogin) {
        res = await login({ email: formData.email, password: formData.password });
      } else {
        res = await register(formData);
      }
      
      localStorage.setItem("token", res.data.token);
      onAuthSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section fade-in">
      <div className="auth-container">
        <button className="auth-back" onClick={goHome}>Cancel</button>
        <div className="auth-card">
          <div className="auth-hdr">
            <div className="auth-icon"><Sparkles size={24} /></div>
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p>{isLogin ? "Log in to view your resume analysis history." : "Sign up to start tracking your resume progress."}</p>
          </div>

          {error && <div className="auth-error"><AlertCircle size={16} /> {error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <div className="input-icon"><User size={18} /></div>
                <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} />
              </div>
            )}
            
            <div className="input-group">
              <div className="input-icon"><Mail size={18} /></div>
              <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} />
            </div>

            <div className="input-group">
              <div className="input-icon"><Lock size={18} /></div>
              <input type="password" name="password" placeholder="Password" required minLength="6" value={formData.password} onChange={handleChange} />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="spinner"></span> : <>{isLogin ? "Log In" : "Sign Up"} <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="auth-footer">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="auth-switch" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;

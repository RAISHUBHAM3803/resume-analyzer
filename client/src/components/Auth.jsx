import React, { useState } from "react";
import { login, register } from "../services/api";
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import "./Auth.css";

function Auth({ onAuthSuccess, goHome }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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

    // Client-side password validation on registration for better UX
    if (!isLogin) {
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        setLoading(false);
        return;
      }
      if (!/[a-zA-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
        setError("Password must contain at least one letter and one number.");
        setLoading(false);
        return;
      }
    }

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
      setError(err.response?.data?.error || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section fade-in">
      <div className="auth-container">
        <button className="auth-back" onClick={goHome}>
          <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Back to home
        </button>
        
        <div className="auth-card">
          <div className="auth-hdr">
            <div className="auth-icon"><Sparkles size={24} /></div>
            <h2>{isLogin ? "Sign in" : "Create Account"}</h2>
            <p>
              {isLogin 
                ? "Enter your credentials to access your insights" 
                : "Join thousands of job seekers optimizing their careers."}
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon-left" size={18} />
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="John Doe" 
                    className="auth-input"
                    required 
                    value={formData.name} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            )}
            
            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon-left" size={18} />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="you@example.com" 
                  className="auth-input"
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon-left" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="••••••••" 
                  className="auth-input"
                  required 
                  minLength={isLogin ? "6" : "8"} 
                  value={formData.password} 
                  onChange={handleChange} 
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isLogin && (
                <span className="input-hint">Must be at least 8 characters with 1 letter & 1 number</span>
              )}
            </div>


            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  {isLogin ? "Sign in" : "Get Started"} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            {isLogin ? "New here?" : "Already have an account?"}
            <button 
              className="auth-switch" 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Auth;

import { useState } from "react";
import { login, register, forgotPassword } from "../services/api";
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle, Eye, EyeOff, MailCheck } from "lucide-react";
import "./Auth.css";

function Auth({ onAuthSuccess, goHome }) {
  const [viewMode, setViewMode] = useState("login"); // "login", "register", "forgot"
  const isLogin = viewMode === "login";
  const isRegister = viewMode === "register";
  const isForgot = viewMode === "forgot";
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Client-side password validation on registration for better UX
    if (isRegister) {
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
      if (isForgot) {
        res = await forgotPassword({ email: formData.email });
        setMessage(res.data.message || "Password reset email sent.");
        setLoading(false);
        return;
      } else if (isLogin) {
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
          {isForgot && message ? (
            <div className="auth-success-state" style={{ textAlign: "center", padding: "2rem 1rem" }}>
              <div style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", marginBottom: "1.5rem", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                <MailCheck size={32} />
              </div>
              <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Check your inbox</h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: "1.6" }}>
                We've sent a password reset link to<br/>
                <strong style={{ color: "var(--text)", marginTop: "0.5rem", display: "inline-block" }}>{formData.email}</strong>
              </p>
              <button 
                className="auth-btn" 
                onClick={() => { setViewMode("login"); setMessage(""); }}
              >
                Back to Sign in
              </button>
            </div>
          ) : (
            <>
              <div className="auth-hdr">
                <div className="auth-icon"><Sparkles size={24} /></div>
                <h2>{isForgot ? "Reset Password" : (isLogin ? "Sign in" : "Create Account")}</h2>
                <p>
                  {isForgot
                    ? "Enter your email to receive a password reset link."
                    : (isLogin 
                      ? "Enter your credentials to access your insights" 
                      : "Join thousands of job seekers optimizing their careers.")}
                </p>
              </div>

              {error && (
                <div className="auth-error">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
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

            {!isForgot && (
              <div className="input-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="input-label">Password</label>
                  {isLogin && (
                    <button 
                      type="button" 
                      onClick={() => { setViewMode("forgot"); setError(""); setMessage(""); }}
                      style={{ background: "none", border: "none", color: "var(--accent)", fontSize: "0.85rem", cursor: "pointer" }}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
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
              {isRegister && (
                <span className="input-hint">Must be at least 8 characters with 1 letter & 1 number</span>
              )}
            </div>
            )}


            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  {isForgot ? "Send Reset Link" : (isLogin ? "Sign in" : "Get Started")} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            {isForgot ? (
              <p>
                Remember your password? <button type="button" onClick={() => { setViewMode("login"); setError(""); setMessage(""); }}>Sign in</button>
              </p>
            ) : isLogin ? (
              <p>
                Don't have an account? <button type="button" onClick={() => { setViewMode("register"); setError(""); setMessage(""); }}>Sign up</button>
              </p>
            ) : (
              <p>
                Already have an account? <button type="button" onClick={() => { setViewMode("login"); setError(""); setMessage(""); }}>Sign in</button>
              </p>
            )}
          </div>
          </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Auth;

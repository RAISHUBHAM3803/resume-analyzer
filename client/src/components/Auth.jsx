import { useState } from "react";
import { login, register, forgotPassword } from "../services/api";
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle, Eye, EyeOff, MailCheck } from "lucide-react";
import "./Auth.css";

function Auth({ onAuthSuccess, goHome }) {
  const [viewMode, setViewMode] = useState("login"); // "login" | "register" | "forgot"
  const isLogin = viewMode === "login";
  const isRegister = viewMode === "register";
  const isForgot = viewMode === "forgot";

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const switchView = (mode) => {
    setViewMode(mode);
    setError("");
    setMessage("");
    setFormData({ name: "", email: "", password: "" });
    setShowPassword(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

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
      if (isForgot) {
        const res = await forgotPassword({ email: formData.email });
        setMessage(res.data.message || "Password reset email sent.");
        setLoading(false);
        return;
      }

      const res = isLogin
        ? await login({ email: formData.email, password: formData.password })
        : await register(formData);

      localStorage.setItem("token", res.data.token);
      onAuthSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Email sent success screen ──────────────────────────────────────
  if (isForgot && message) {
    return (
      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-card auth-card--center">
            <div className="auth-success-icon">
              <MailCheck size={32} />
            </div>
            <h2 className="auth-success-title">Check your inbox</h2>
            <p className="auth-success-body">
              We've sent a password reset link to<br />
              <strong>{formData.email}</strong>
            </p>
            <p className="auth-success-note">
              Didn't receive it? Check your spam folder or&nbsp;
              <button className="auth-link" onClick={() => switchView("forgot")}>
                try again
              </button>.
            </p>
            <button className="auth-btn" onClick={() => switchView("login")}>
              Back to Sign in <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────
  return (
    <section className="auth-section">
      <div className="auth-container">

        <button className="auth-back-btn" onClick={goHome}>
          <ArrowRight size={14} className="auth-back-icon" />
          Back to home
        </button>

        <div className="auth-card">

          {/* Header */}
          <div className="auth-hdr">
            <div className="auth-brand-icon">
              <Sparkles size={22} />
            </div>
            <h1 className="auth-title">
              {isForgot ? "Reset Password" : isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="auth-subtitle">
              {isForgot
                ? "Enter your email and we'll send you a reset link."
                : isLogin
                ? "Sign in to access your resume insights."
                : "Join thousands of job seekers optimizing their resumes."}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="auth-alert auth-alert--error" role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* Full name (register only) */}
            {isRegister && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-name">Full Name</label>
                <div className="auth-input-wrap">
                  <User className="auth-input-icon" size={17} />
                  <input
                    id="auth-name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="auth-input"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail className="auth-input-icon" size={17} />
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="auth-input"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password (login + register only) */}
            {!isForgot && (
              <div className="auth-field">
                <div className="auth-label-row">
                  <label className="auth-label" htmlFor="auth-password">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      className="auth-link"
                      onClick={() => switchView("forgot")}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="auth-input-wrap">
                  <Lock className="auth-input-icon" size={17} />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="auth-input auth-input--password"
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    minLength={isLogin ? 6 : 8}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {isRegister && (
                  <p className="auth-hint">Min 8 characters · at least 1 letter &amp; 1 number</p>
                )}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  {isForgot ? "Send Reset Link" : isLogin ? "Sign in" : "Create account"}
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="auth-footer-text">
            {isForgot ? (
              <>
                Remember it?&nbsp;
                <button className="auth-link" onClick={() => switchView("login")}>Sign in</button>
              </>
            ) : isLogin ? (
              <>
                Don't have an account?&nbsp;
                <button className="auth-link" onClick={() => switchView("register")}>Sign up</button>
              </>
            ) : (
              <>
                Already have an account?&nbsp;
                <button className="auth-link" onClick={() => switchView("login")}>Sign in</button>
              </>
            )}
          </p>

        </div>
      </div>
    </section>
  );
}

export default Auth;

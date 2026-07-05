import { useState } from "react";
import { resetPassword } from "../services/api";
import { Lock, ScanSearch, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import "./Auth.css";

function ResetPassword({ token, goHome, goAuth }) {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
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

    try {
      await resetPassword(token, { password: formData.password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────
  if (success) {
    return (
      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-card auth-card--center">
            <div className="auth-success-icon" style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.25)", color: "#10b981" }}>
              <CheckCircle size={32} />
            </div>
            <h2 className="auth-success-title">Password updated!</h2>
            <p className="auth-success-body">
              Your password has been successfully reset. You can now sign in with your new credentials.
            </p>
            <button className="auth-btn" onClick={goAuth}>
              Go to Sign in <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────
  return (
    <section className="auth-section">
      <div className="auth-container">

        <button className="auth-back-btn" onClick={goHome}>
          <ArrowRight size={14} className="auth-back-icon" />
          Back to home
        </button>

        <div className="auth-card">

          <div className="auth-hdr">
            <div className="auth-brand-icon">
              <ScanSearch size={22} />
            </div>
            <h1 className="auth-title">Create new password</h1>
            <p className="auth-subtitle">
              Enter a strong new password for your account.
            </p>
          </div>

          {error && (
            <div className="auth-alert auth-alert--error" role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            <div className="auth-field">
              <label className="auth-label" htmlFor="rp-password">New Password</label>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" size={17} />
                <input
                  id="rp-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="auth-input auth-input--password"
                  required
                  autoComplete="new-password"
                  minLength="8"
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
              <p className="auth-hint">Min 8 characters · at least 1 letter &amp; 1 number</p>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="rp-confirm">Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" size={17} />
                <input
                  id="rp-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="auth-input auth-input--password"
                  required
                  autoComplete="new-password"
                  minLength="8"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>Reset Password <ArrowRight size={17} /></>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Remember your password?&nbsp;
            <button className="auth-link" onClick={goAuth}>Sign in</button>
          </p>

        </div>
      </div>
    </section>
  );
}

export default ResetPassword;

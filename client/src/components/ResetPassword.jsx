import { useState } from "react";
import { resetPassword } from "../services/api";
import { Lock, Sparkles, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import "./ResetPassword.css";

function ResetPassword({ token, goHome, goAuth }) {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
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
      setError(err.response?.data?.error || "Failed to reset password. The token may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="auth-section fade-in">
        <div className="auth-container">
          <div className="auth-card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: "0 auto 1rem" }} />
            <h2>Password Reset Complete</h2>
            <p style={{ marginBottom: "2rem" }}>Your password has been successfully updated. You can now sign in with your new password.</p>
            <button className="auth-btn" onClick={goAuth}>
              Go to Sign In <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-section fade-in">
      <div className="auth-container">
        <button className="auth-back" onClick={goHome}>
          <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Back to home
        </button>
        
        <div className="auth-card">
          <div className="auth-hdr">
            <div className="auth-icon"><Sparkles size={24} /></div>
            <h2>Create New Password</h2>
            <p>Please enter your new password below.</p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">New Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon-left" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="••••••••" 
                  className="auth-input"
                  required 
                  minLength="8" 
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
              <span className="input-hint">Must be at least 8 characters with 1 letter & 1 number</span>
            </div>

            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon-left" size={18} />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  placeholder="••••••••" 
                  className="auth-input"
                  required 
                  minLength="8" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="spinner"></span> : <>Reset Password <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;

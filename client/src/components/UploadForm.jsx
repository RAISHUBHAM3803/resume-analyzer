import { useState, useRef } from "react";
import { Upload, FileText, X, ArrowLeft, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadResume } from "../services/api";
import "./UploadForm.css";

function UploadForm({ onResult, onBack }) {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);



  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const onDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false); setError("");
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file only.");
    } else if (f.size > MAX_SIZE) {
      setError("File size exceeds the 10MB limit. Please upload a smaller file.");
    } else {
      setFile(f);
    }
  };

  const onFileChange = (e) => {
    setError("");
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file only.");
      if (inputRef.current) inputRef.current.value = "";
    } else if (f.size > MAX_SIZE) {
      setError("File size exceeds the 10MB limit. Please upload a smaller file.");
      if (inputRef.current) inputRef.current.value = "";
    } else {
      setFile(f);
    }
  };

  const removeFile = () => { setFile(null); if (inputRef.current) inputRef.current.value = ""; };

  const handleJobDescChange = (e) => {
    const val = e.target.value;
    if (val.length <= 5000) {
      setJobDesc(val);
    }
  };

  const fmtSize = (b) => {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(1) + " MB";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true); setError(""); setProgress(0);

    const fd = new FormData();
    fd.append("resume", file);
    fd.append("jobDescription", jobDesc);

    const timer = setInterval(() => {
      setProgress((p) => { if (p >= 90) { clearInterval(timer); return 90; } return p + Math.random() * 15; });
    }, 300);

    try {
      const res = await uploadResume(fd);
      clearInterval(timer); setProgress(100);
      setTimeout(() => onResult(res.data), 400);
    } catch (err) {
      clearInterval(timer); setProgress(0);
      setError(err.response?.data?.error || "Error analyzing resume. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="upload-section">
      <div className="upload-container">
        <button className="upload-back" onClick={onBack}><ArrowLeft size={18} /> Back to Home</button>

        <div className="upload-card fade-in">
          <div className="upload-card__hdr">
            <div className="upload-card__icon"><Sparkles size={24} /></div>
            <h1 className="upload-card__title">Analyze Your Resume</h1>
            <p className="upload-card__desc">Upload your PDF resume and optionally add a job description for targeted matching.</p>
          </div>

          <form onSubmit={handleSubmit} className="upload-form">
            {/* Step 1 */}
            <div className="upload-step">
              <div className="upload-step__lbl"><span className="upload-step__num">1</span> Upload Resume</div>
              <div
                className={`dropzone ${dragActive ? "dropzone--active" : ""} ${file ? "dropzone--filled" : ""}`}
                onDragEnter={onDrag} onDragOver={onDrag} onDragLeave={onDrag} onDrop={onDrop}
                onClick={() => !file && inputRef.current?.click()}
              >
                <input ref={inputRef} type="file" accept=".pdf" onChange={onFileChange} className="dropzone__input" />
                {file ? (
                  <div className="dropzone__file">
                    <div className="file-info">
                      <div className="file-icon"><FileText size={24} /></div>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{fmtSize(file.size)}</span>
                      </div>
                      <button type="button" className="file-remove" onClick={(e) => { e.stopPropagation(); removeFile(); }}><X size={16} /></button>
                    </div>
                    <div className="file-ready"><CheckCircle2 size={14} /> Ready for analysis</div>
                  </div>
                ) : (
                  <div className="dropzone__placeholder">
                    <div className="dropzone__circle"><Upload size={28} /></div>
                    <p><span className="dropzone__hl">Click to upload</span> or drag & drop</p>
                    <p className="dropzone__hint">PDF files only • Max 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div className="upload-step">
              <div className="upload-step__lbl"><span className="upload-step__num">2</span> Job Description <span className="optional">(Optional)</span></div>
              <div className="textarea-wrap">
                <textarea
                  className="upload-textarea"
                  placeholder="Paste the job description here for a more accurate skills match..."
                  value={jobDesc} onChange={handleJobDescChange} rows={6}
                />
                {jobDesc && <div className="textarea-count">{jobDesc.length} / 5000 chars</div>}
              </div>
            </div>

            {error && (
              <div className="upload-error"><AlertCircle size={16} /> {error}</div>
            )}

            <button type="submit" className="upload-submit" disabled={!file || loading}>
              {loading ? (
                <span className="upload-loading">
                  <span className="spinner"></span> Analyzing... <span className="prog-text">{Math.round(progress)}%</span>
                </span>
              ) : (
                <><Sparkles size={18} /> Analyze & Match</>
              )}
            </button>

            {loading && (
              <div className="prog-bar"><div className="prog-fill" style={{width: `${progress}%`}}></div></div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default UploadForm;

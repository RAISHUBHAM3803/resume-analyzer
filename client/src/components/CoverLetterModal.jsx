import { useState } from "react";
import { X, Copy, Wand2, Check } from "lucide-react";
import "./CoverLetterModal.css";

function CoverLetterModal({ coverLetter, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content cl-modal fade-in-up">
        <div className="modal-header">
          <div className="modal-title">
            <Wand2 size={20} className="c-accent" />
            <h2>Your Tailored Cover Letter</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="cl-body">
          <p className="cl-desc">
            We generated this cover letter based on your resume and the target job description. Feel free to copy and tweak it before applying!
          </p>
          <div className="cl-textarea-wrapper">
            <textarea
              className="cl-textarea"
              value={coverLetter}
              readOnly
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="dash__btn" onClick={onClose}>
            Close
          </button>
          <button 
            className="dash__btn dash__btn--primary" 
            onClick={handleCopy}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} 
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoverLetterModal;

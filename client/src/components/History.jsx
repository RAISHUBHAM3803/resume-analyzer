import { useState, useEffect } from "react";
import { ArrowLeft, Clock, FileText, Target, Trophy, AlertCircle, Trash2, Calendar } from "lucide-react";
import { getHistory, deleteHistory } from "../services/api";
import "./History.css";

function History({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      try {
        const res = await getHistory();
        if (active) setHistory(res.data);
      } catch {
        if (active) setError("Failed to fetch history.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchHistory();
    return () => {
      active = false;
    };
  }, [refreshCount]);

  const handleDelete = async (timeframe) => {
    if (!window.confirm(`Are you sure you want to delete ${timeframe === 'all' ? 'all' : 'the last ' + timeframe} history?`)) return;
    
    setIsDeleting(true);
    try {
      await deleteHistory(timeframe);
      setLoading(true);
      setRefreshCount((c) => c + 1); // Refresh
    } catch {
      alert("Failed to delete history.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <section className="history-section">
      <div className="history-container fade-in-up">
        
        <div className="history-top-row">
          <button className="history-back" onClick={onBack}>
            <ArrowLeft size={16} /> 
            <span>Back to Dashboard</span>
          </button>
          
          <div className="history-actions">
            <span className="history-actions-lbl"><Trash2 size={14} /> Clear History:</span>
            <div className="history-actions-group">
              <button className="history-btn" onClick={() => handleDelete('1h')} disabled={isDeleting}>1 Hour</button>
              <button className="history-btn" onClick={() => handleDelete('24h')} disabled={isDeleting}>24 Hours</button>
              <button className="history-btn history-btn--danger" onClick={() => handleDelete('all')} disabled={isDeleting}>All Time</button>
            </div>
          </div>
        </div>
        
        <div className="history-hdr">
          <div className="history-hdr-icon"><Clock size={24} /></div>
          <h1 className="history-hdr-title">Your Analysis History</h1>
          <p className="history-hdr-desc">Track your resume improvement over time and revisit past analyses.</p>
        </div>

        {loading ? (
          <div className="history-state fade-in">
            <div className="spinner"></div> 
            <p>Loading history...</p>
          </div>
        ) : error ? (
          <div className="history-state history-state--error fade-in">
            <AlertCircle size={24} /> 
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="history-state history-state--empty fade-in">
            <div className="history-state-icon"><FileText size={40} /></div>
            <h3>No past analyses found</h3>
            <p>Your analysis history will appear here once you analyze a resume.</p>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((item, i) => (
              <div key={item._id} className="history-card fade-in-up" style={{ animationDelay: `${0.05 * i}s` }}>
                <div className="hcard-top">
                  <div className="hcard-date">
                    <Calendar size={14} />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <div className={`hcard-score ${item.score >= 80 ? "score-high" : item.score >= 50 ? "score-mid" : "score-low"}`}>
                    <Trophy size={14} /> 
                    <span>{item.score}<small>/100</small></span>
                  </div>
                </div>
                
                <div className="hcard-file">
                  <div className="hcard-file-icon">
                    <FileText size={20} />
                  </div>
                  <div className="hcard-file-info">
                    <span className="hcard-file-name" title={item.fileName || "Resume.pdf"}>
                      {item.fileName || "Resume.pdf"}
                    </span>
                    <span className="hcard-file-type">PDF Document</span>
                  </div>
                </div>
                
                <div className="hcard-skills">
                  <Target size={16} /> 
                  <span><strong>{item.skills?.length || 0}</strong> Skills Identified</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default History;

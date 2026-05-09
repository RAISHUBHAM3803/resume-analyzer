import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, FileText, Target, Trophy, AlertCircle, Trash2 } from "lucide-react";
import { getHistory, deleteHistory } from "../services/api";
import "./History.css";

function History({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getHistory();
      setHistory(res.data);
    } catch (err) {
      setError("Failed to fetch history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (timeframe) => {
    if (!window.confirm(`Are you sure you want to delete ${timeframe === 'all' ? 'all' : 'the last ' + timeframe} history?`)) return;
    
    setIsDeleting(true);
    try {
      await deleteHistory(timeframe);
      fetchHistory(); // Refresh
    } catch (err) {
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
      <div className="history-container fade-in">
        <div className="history-top-row">
          <button className="history-back" onClick={onBack}><ArrowLeft size={18} /> Back to Home</button>
          
          <div className="delete-actions">
            <span className="delete-lbl"><Trash2 size={14} /> Clear History:</span>
            <button className="delete-btn" onClick={() => handleDelete('1h')} disabled={isDeleting}>Last 1h</button>
            <button className="delete-btn" onClick={() => handleDelete('24h')} disabled={isDeleting}>Last 24h</button>
            <button className="delete-btn delete-btn--danger" onClick={() => handleDelete('all')} disabled={isDeleting}>All</button>
          </div>
        </div>
        
        <div className="history-hdr">
          <div className="history-hdr-icon"><Clock size={24} /></div>
          <h1>Your Analysis History</h1>
          <p>Track your resume improvement over time</p>
        </div>

        {loading ? (
          <div className="history-loading"><span className="spinner"></span> Loading history...</div>
        ) : error ? (
          <div className="history-error"><AlertCircle size={18} /> {error}</div>
        ) : history.length === 0 ? (
          <div className="history-empty">
            <FileText size={48} className="empty-icon" />
            <p>No past analyses found.</p>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((item) => (
              <div key={item._id} className="history-card">
                <div className="hcard-top">
                  <div className="hcard-date">{formatDate(item.createdAt)}</div>
                  <div className={`hcard-score ${item.score >= 80 ? "score-high" : item.score >= 50 ? "score-mid" : "score-low"}`}>
                    <Trophy size={14} /> {item.score}/100
                  </div>
                </div>
                <div className="hcard-file">
                  <FileText size={18} className="file-icon" />
                  <span className="file-name">{item.fileName || "Resume.pdf"}</span>
                </div>
                <div className="hcard-skills">
                  <Target size={14} /> {item.skills.length} Skills Identified
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

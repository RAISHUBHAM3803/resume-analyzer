import { useState, useEffect } from "react";
import { ArrowLeft, Clock, FileText, Target, Trophy, AlertCircle, Trash2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <section className="history-section">
      <div className="history-container">
        
        <motion.div 
          className="history-top-row"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
        </motion.div>
        
        <motion.div 
          className="history-hdr"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="history-hdr-icon"><Clock size={24} /></div>
          <h1 className="history-hdr-title">Your Analysis History</h1>
          <p className="history-hdr-desc">Track your resume improvement over time and revisit past analyses.</p>
        </motion.div>

        {loading ? (
          <motion.div className="history-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="spinner"></div> 
            <p>Loading history...</p>
          </motion.div>
        ) : error ? (
          <motion.div className="history-state history-state--error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AlertCircle size={24} /> 
            <p>{error}</p>
          </motion.div>
        ) : history.length === 0 ? (
          <motion.div className="history-state history-state--empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="history-state-icon"><FileText size={40} /></div>
            <h3>No past analyses found</h3>
            <p>Your analysis history will appear here once you analyze a resume.</p>
          </motion.div>
        ) : (
          <motion.div 
            className="history-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {history.map((item, i) => (
              <motion.div key={item._id} className="history-card" variants={cardVariant}>
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default History;

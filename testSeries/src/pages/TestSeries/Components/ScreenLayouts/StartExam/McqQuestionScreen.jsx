import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './McqQuestionScreen.css';
import candidateAvatar from './candidate_avatar.png';

const McqQuestionScreen = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(3428); // 57:08 in seconds
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Timer logic
  useEffect(() => {
    let timer;
    if (!isPaused && !isSubmitModalOpen) {
      timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused, isSubmitModalOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    navigate('/testseries/exam/performance');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="mcq-screen-container">
      {/* Top Header */}
      <div className="mcq-header">
        <div className="mcq-header-left">RankU1 Online Assessment</div>
        <div className="mcq-header-right">
          <span className="candidate-name">dhanshri</span>
          <div className="timer-box">
            Time Left: {formatTime(timeLeft)}
          </div>
          <button className="exit-btn">×</button>
        </div>
      </div>

      {/* Sections Bar */}
      <div className="sections-bar">
        <div className="section-tab active">Default</div>
      </div>

      {/* Main Content */}
      <div className="mcq-main">
        <div className="mcq-left">
          <div className="question-header">
            <span className="question-number">Question No. 2</span>
            <div className="language-selector">
              View In: <select className="lang-select"><option>English</option></select>
            </div>
          </div>
          
          <div className="question-content">
            <p className="question-text">yguygkkjm</p>
            
            <div className="options-list">
              {['ytyfukg', 'jikhk', 'fkqkj', 'ugkjglh,'].map((opt, idx) => {
                const label = String.fromCharCode(65 + idx);
                return (
                  <label key={label} className={`option-item ${selectedOption === label ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="option" 
                      checked={selectedOption === label}
                      onChange={() => setSelectedOption(label)}
                    />
                    <span className="option-label">{label}</span>
                    <span className="option-text">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Question Footer */}
          <div className="mcq-footer">
            <div className="footer-left">
              <button className="btn-secondary">Mark for Review & Next</button>
              <button className="btn-secondary" onClick={() => setSelectedOption(null)}>Clear Response</button>
            </div>
            <div className="footer-right">
              <button className="btn-primary">Save & Next</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="mcq-sidebar">
          <div className="sidebar-candidate">
            <img src={candidateAvatar} alt="candidate" />
            <span>dhanshri</span>
          </div>
          
          <div className="status-summary">
            <div className="status-item"><span className="count-box answered">0</span> Answered</div>
            <div className="status-item"><span className="count-box not-answered">1</span> Not Answered</div>
            <div className="status-item"><span className="count-box not-visited">0</span> Not Visited</div>
            <div className="status-item"><span className="count-box marked">1</span> Marked for Review</div>
            <div className="status-item full"><span className="count-box marked-answered">0</span> Answered & Marked for Review</div>
          </div>

          <div className="sidebar-section-header">Default</div>
          <div className="question-grid">
            <div className="grid-item answered-marked">1</div>
            <div className="grid-item current">2</div>
          </div>

          <div className="sidebar-actions">
            <div className="action-row">
              <button className="btn-sidebar" onClick={() => setIsPaused(true)}>Pause</button>
              <button className="btn-sidebar">Question Paper</button>
            </div>
            <button className="btn-submit" onClick={() => setIsSubmitModalOpen(true)}>Submit</button>
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      {isPaused && (
        <div className="pause-overlay">
          <div className="pause-modal">
            <h2 className="pause-title">Test Paused</h2>
            <p className="pause-message">Your progress is saved. Resume whenever you are ready.</p>
            <div className="pause-actions">
              <button className="btn-resume" onClick={() => setIsPaused(false)}>
                <span className="pause-icon">⏸</span> Resume Test
              </button>
              <button className="btn-home" onClick={() => navigate('/')}>
                <span className="pause-icon">🏠</span> Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {isSubmitModalOpen && (
        <div className="submit-overlay">
          <div className="submit-modal">
            <button className="modal-close" onClick={() => setIsSubmitModalOpen(false)}>×</button>
            <div className="modal-icon-container">
              <div className="warning-icon">!</div>
            </div>
            <h2 className="submit-title">Submit Test</h2>
            <p className="submit-message">
              Final submission? You won't be able to change your answers after this.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsSubmitModalOpen(false)}>Cancel</button>
              <button className="btn-confirm" onClick={handleConfirmSubmit}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default McqQuestionScreen;

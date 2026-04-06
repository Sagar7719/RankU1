import React from 'react';
import './TestAvailableSoon.css'; // We'll create this CSS file

const TestAvailableSoonComponent = ({ test, onButtonClick }) => {
  return (
    <div className="test-card">
      <div className="test-card-body">
        {/* Icon Section */}
        <div className="test-icon-section">
          <div className="icon-wrapper">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="lock-icon"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        {/* Info Section */}
        <div className="test-info-section">
          <div className="test-title-wrapper">
            <h3 className="test-title">{test.TestTitle}</h3>
          </div>

          <div className="test-subtitle">
            RankU1's Mock Test for {test.SeriesTitle}
          </div>

          <div className="test-meta">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {/* {test.duration} */}
            </span>
            <span className="meta-separator">•</span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
              </svg>
              {/* {test.marks} */}
            </span>
            <span className="meta-separator">•</span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              {/* {test.questionType} */}
            </span>
          </div>
        </div>

        {/* Available Soon Button */}
        <div className="test-action-section">
          <button 
            className="available-soon-button"
            disabled
            onClick={() => onButtonClick && onButtonClick(test)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Available Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestAvailableSoonComponent;
// ScheduledTestCardComponent.js
import React from 'react';
import './ScheduledCard.css';

const ScheduledTestCardComponent = ({ test, onButtonClick }) => {
  // SVG Icons as inline components
  const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  const ClockIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const AwardIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"></circle>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
  );

  const FileTextIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  return (
    <div className="scheduled-card">
      <div className="scheduled-card__body">
        {/* Icon Section */}
        <div className="scheduled-card__icon">
          <div className="scheduled-card__icon-wrapper">
            <LockIcon />
          </div>
        </div>

        {/* Info Section */}
        <div className="scheduled-card__info">
          <div className="scheduled-card__top">
            <h3 className="scheduled-card__title">{test.TestTitle}</h3>
          </div>

          <div className="scheduled-card__subtitle">
            RankU1's Mock Test for {test.SeriesTitle}
          </div>

          <div className="scheduled-card__meta">
            <span className="scheduled-card__meta-item">
              <ClockIcon size={14} /> {test.duration}
            </span>
            <span className="scheduled-card__dot">•</span>
            <span className="scheduled-card__meta-item">
              <AwardIcon size={14} /> {test.marks}
            </span>
            <span className="scheduled-card__dot">•</span>
            <span className="scheduled-card__meta-item">
              <FileTextIcon size={14} /> {test.questionType}
            </span>
          </div>
        </div>

        {/* Scheduled Date Button */}
        <div className="scheduled-card__action">
          <button 
            className="scheduled-card__button scheduled-card__button--disabled"
            disabled
            onClick={() => onButtonClick && onButtonClick(test)}
          >
            <ClockIcon size={16} />
            <span>Available on {test.scheduledDate}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduledTestCardComponent;
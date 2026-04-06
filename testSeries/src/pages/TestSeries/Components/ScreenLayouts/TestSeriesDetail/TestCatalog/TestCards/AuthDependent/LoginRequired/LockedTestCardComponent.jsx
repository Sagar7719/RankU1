// lockedtestcardcomponent
import React from 'react';
import './LockedTestCard.css';

const LockedTestCardComponent = ({ test, isLoggedIn, onButtonClick, ExamCategory }) => {
  // Extract duration number from string like "90 mins"
  const extractDuration = (durationStr) => {
    if (!durationStr) return 60;
    const match = durationStr.match(/\d+/);
    return match ? parseInt(match[0]) : 60;
  };

  // Extract marks number from string like "250 marks"
  const extractMarks = (marksStr) => {
    if (!marksStr) return 0;
    const match = marksStr.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Get the first TestCategory from the test's TestCategory array
  // const getTestCategory = () => {
  //   if (test.TestCategory && test.TestCategory.length > 0) {
  //     return test.TestCategory[0];
  //   }
  //   return 'Practice';
  // };

  // Format the description
  // const getDescription = () => {
  //   const testCategory = getTestCategory();
  //   return `RankU1's ${testCategory} for ${ExamCategory}.`;
  // };

  return (
    <div className="tsd-item-premium is-locked">
      <div className="tsd-item-main">
        {/* Icon Section */}
        <div className="tsd-item-icon">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="lucide lucide-lock text-muted"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        {/* Info Section */}
        <div className="tsd-item-info">
          <div className="tsd-item-top">
            <h3>{test.TestTitle}</h3>
          </div>
          <div className="tsd-item-meta">
            <span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {extractDuration(test.duration)} mins
            </span>
            <span className="tsd-dot">•</span>
            <span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                <circle cx="12" cy="8" r="6"></circle>
              </svg>
              {extractMarks(test.marks)} marks
            </span>
            <span className="tsd-dot">•</span>
            <span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 9H8"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
              </svg>
              {test.questionType}
            </span>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="tsd-action-group">
        {!isLoggedIn ? (
          <button 
            type="button" 
            className="tsd-action-btn locked"
            onClick={() => onButtonClick && onButtonClick(test)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Login to Unlock</span>
          </button>
        ) : (
          <button 
            type="button" 
            className="tsd-action-btn"
            onClick={() => onButtonClick && onButtonClick(test)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Unlock Now</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LockedTestCardComponent;
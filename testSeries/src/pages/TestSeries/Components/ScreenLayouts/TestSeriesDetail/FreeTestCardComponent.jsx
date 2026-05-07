import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FreeTestCard.css';

const FreeTestCardComponent = ({ test, isLoggedIn, onButtonClick, ExamCategory }) => {
  const navigate = useNavigate();

  // Get the first TestCategory from the test's TestCategory array
  const getTestCategory = () => {
    if (test.TestCategory && test.TestCategory.length > 0) {
      return test.TestCategory[0];
    }
    return 'Practice';
  };

  // Format the description
  const getDescription = () => {
    const testCategory = getTestCategory();
    return `RankU1's ${testCategory} for ${ExamCategory || 'target exam'}.`;
  };

  // Handle Start Exam - Only for logged in users
  const handleStartExam = (testData) => {
    if (isLoggedIn) {
      // Store current test data for the exam session
      localStorage.setItem('currentTest', JSON.stringify(testData));
      // Navigate to Selection Portal
      navigate('/testseries/exam/selection');
    }
  };

  // Handle Login Click - Just call the parent handler, no navigation
  const handleLoginClick = (testData) => {
    if (onButtonClick) {
      onButtonClick(testData);
    }
  };

  // SVG Icons matching the design system
  const LockOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
    </svg>
  );

  const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
      <circle cx="12" cy="8" r="6"></circle>
    </svg>
  );

  const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
      <path d="M10 9H8"></path>
      <path d="M16 13H8"></path>
      <path d="M16 17H8"></path>
    </svg>
  );

  const PlayCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polygon points="10 8 16 12 10 16 10 8"></polygon>
    </svg>
  );

  return (
    <div className="tsd-item-premium">
      <div className="tsd-item-main">
        {/* Icon Section */}
        <div className="tsd-item-icon">
          <LockOpenIcon />
        </div>

        {/* Info Section */}
        <div className="tsd-item-info">
          <div className="tsd-item-top">
            <h3>{test.TestTitle}</h3>
            {test.status === 'free' && (
              <span className="tsd-badge-free">FREE</span>
            )}
          </div>
          
          {/* Description */}
          <div className="tsd-item-description">
            {getDescription()}
          </div>
          
          <div className="tsd-item-meta">
            <span>
              <ClockIcon /> {test.duration}
            </span>
            <span className="tsd-dot">•</span>
            <span>
              <AwardIcon /> {test.marks}
            </span>
            <span className="tsd-dot">•</span>
            <span>
              <FileTextIcon /> {test.questionType}
            </span>
          </div>
        </div>

        {/* Action Section */}
        <div className="tsd-action-group">
          {!isLoggedIn ? (
            <button 
              type="button" 
              className="tsd-action-btn primary"
              onClick={() => handleLoginClick(test)}
            >
              <PlayCircleIcon />
              <span>Login</span>
            </button>
          ) : (
            <button 
              type="button" 
              className="tsd-action-btn primary"
              onClick={() => handleStartExam(test)}
            >
              <PlayCircleIcon />
              <span>Start</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeTestCardComponent;
import React from 'react';
// import { useNavigate } from 'react-router-dom';
import BackButton from '../../Common/BackButtonComponent';
import './NoQuestionsScreen.css';

const NoQuestionsScreen = () => {
  // const navigate = useNavigate();

  return (
    <div className="no-questions-container">
      <div className="no-questions-content">
        {/* Back Button */}
        <div className="no-questions-back-wrapper">
          <BackButton />
        </div>

        {/* Main Content */}
        <div className="no-questions-main">
          <div className="no-questions-icon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="no-questions-title">No Questions Found</h2>
          <p className="no-questions-description">
            Questions for this test are currently being prepared. Please check back later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoQuestionsScreen;
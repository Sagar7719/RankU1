import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LanguageSelectionScreen.css';
import candidateAvatar from './candidate_avatar.png';

const LanguageSelectionScreen = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleStart = () => {
    if (!termsAccepted) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }
    // Proceed to exam (mcq-question screen)
    navigate('/testseries/exam/mcq-question');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="language-selection-container">
      {/* Header */}
      <div className="tcs-header">
        <div className="tcs-header-left">
          Other Important Instructions
        </div>
        <div className="tcs-header-right">
          Candidate Name: <b>dhanshri</b>
          <div className="tcs-avatar-small">
            <img src={candidateAvatar} alt="avatar" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="tcs-main-container">
        <div className="tcs-left-panel">
          <div className="language-box">
            <label>
              Choose your Secondary Language:
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-dropdown"
              >
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
              </select>
            </label>
          </div>

          <div className="terms-checkbox-section">
            <label className="custom-checkbox">
              <input 
                type="checkbox" 
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)} 
              />
              <span className="checkbox-text">
                I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test.
              </span>
            </label>
          </div>
        </div>

        <div className="tcs-right-panel">
          <div className="tcs-candidate-photo">
            <img src={candidateAvatar} alt="dhanshri" />
          </div>
          <div className="tcs-candidate-name">dhanshri</div>
        </div>
      </div>

      {/* Footer */}
      <div className="tcs-footer">
        <button className="tcs-back-btn" onClick={handleBack}>&lt; Previous</button>
        <button 
          className={`tcs-start-btn ${termsAccepted ? 'active' : ''}`} 
          onClick={handleStart}
          disabled={!termsAccepted}
        >
          I am ready to begin
        </button>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;

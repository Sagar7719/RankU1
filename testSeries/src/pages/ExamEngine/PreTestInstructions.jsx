import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PreTestInstructions.css';

const PreTestInstructions = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);
  const [language, setLanguage] = useState('English');

  const location = useLocation();
  const { selectedInterface, secondaryLanguage } = location.state || { selectedInterface: 'TCS Interface', secondaryLanguage: 'English' };

  const candidateName = user?.name || 'dhanshri';

  return (
    <div className="tcs-instructions-wrapper">
      {/* Top Header */}
      <div className="tcs-top-bar">
        <h2>Other Important Instructions</h2>
        <div className="tcs-candidate-info">
          Candidate Name: <strong>{candidateName}</strong>
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=e2e8f0`} alt="Candidate" className="tcs-candidate-img-small" />
        </div>
      </div>

      <div className="tcs-main-content">
        {/* Main Instructions Area */}
        <div className="tcs-instructions-area">
          {step === 1 ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div className="legend-item"><div className="icon-box icon-ans">5</div> You have answered the question.</div>
                <div className="legend-item"><div className="icon-box icon-review">7</div> You have NOT answered the question, but have marked the question for review.</div>
                <div className="legend-item"><div className="icon-box icon-ans-review">9</div> The question(s) "Answered and Marked for Review" will be considered for evaluation.</div>
              </div>

              <div className="tcs-instruction-section">
                <h3>Navigating to a Question:</h3>
                <p>3. To select a question to answer, you can do one of the following:</p>
                <ul>
                  <li>Click on the question number on the question palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</li>
                  <li>Click on <strong>Save and Next</strong> to save answer to current question and to go to the next question in sequence.</li>
                  <li>Click on <strong>Mark for Review and Next</strong> to save answer to current question, mark it for review, and to go to the next question in sequence.</li>
                </ul>
              </div>

              <div className="tcs-instruction-section">
                <h3>Answering a Question:</h3>
                <p>4. Procedure for answering a multiple choice (MCQ) type question:</p>
                <ul>
                  <li>To select your answer, click on one of the option buttons.</li>
                  <li>To change your answer, click another desired option button.</li>
                  <li>To save your answer, you MUST click on <strong>Save & Next</strong>.</li>
                  <li>To deselect a chosen answer, click on the chosen option again or click on the <strong>Clear Response</strong> button.</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="tcs-language-select">
                <strong>Choose your Secondary Language:</strong>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>

              <div className="tcs-terms">
                <input 
                  type="checkbox" 
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                />
                <p>I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test.</p>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="tcs-right-sidebar">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=2c3e50&color=fff&size=128`} alt="Candidate" className="tcs-candidate-img-large" />
          <div className="tcs-candidate-name">{candidateName}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="tcs-footer">
        {step === 1 ? (
          <button className="tcs-next-btn" onClick={() => setStep(2)}>Next &gt;</button>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <button className="tcs-next-btn" onClick={() => setStep(1)}>&lt; Previous</button>
            <button 
              className="tcs-start-btn" 
              disabled={!isAgreed}
              onClick={() => {
                if (!user) {
                  alert("Please login to start the test.");
                  navigate('/login');
                  return;
                }
                navigate(`/take-test/${testId}`, {
                  state: { selectedInterface, secondaryLanguage: language || secondaryLanguage }
                });
              }}
            >
              I am ready to begin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreTestInstructions;

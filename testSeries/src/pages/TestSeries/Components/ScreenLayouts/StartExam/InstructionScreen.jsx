import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InstructionScreen.css';
import candidateAvatar from './candidate_avatar.png';

const InstructionScreen = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleProceed = () => {
    // Navigate to language selection screen
    navigate('/testseries/exam/language-selection');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="instruction-screen-container">
      {/* Header */}
      <div className="tcs-header">
        <div className="tcs-header-left">
          RankU1 Assessment Portal
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
          <div className="instructions-content">
            <h2>General Instructions:</h2>
            <ol>
              <li>The clock has been set at the server and the countdown timer at the top right corner of your screen will display the time remaining for you to complete the exam. When the clock runs out the exam ends by default - you are not required to end or submit your exam.</li>
              <li>The question palette at the right of screen shows one of the following statuses of each of the questions numbered:</li>
            </ol>
            
            <div className="tcs-legend-grid">
              <div className="legend-item">
                <span className="tcs-legend-icon unvisited">1</span>
                You have not visited the question yet.
              </div>
              <div className="legend-item">
                <span className="tcs-legend-icon not-answered">3</span>
                You have visited the question but not answered the same.
              </div>
              <div className="legend-item">
                <span className="tcs-legend-icon answered">5</span>
                You have answered the question.
              </div>
              <div className="legend-item">
                <span className="tcs-legend-icon marked">7</span>
                You have NOT answered the question, but have marked the question for review.
              </div>
              <div className="legend-item full-width">
                <span className="tcs-legend-icon marked-answered">9</span>
                The question(s) "Answered and Marked for Review" will be considered for evaluation.
              </div>
            </div>

            <h3>Navigating to a Question:</h3>
            <ol start="3">
              <li>To select a question to answer, you can do one of the following:</li>
            </ol>
            <ul className="tcs-bullet-list">
              <li>Click on the question number on the question palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</li>
              <li>Click on <strong>Save and Next</strong> to save answer to current question and to go to the next question in sequence.</li>
              <li>Click on <strong>Mark for Review and Next</strong> to save answer to current question, mark it for review, and to go to the next question in sequence.</li>
            </ul>

            <h3>Answering a Question:</h3>
            <ol start="4">
              <li>Procedure for answering a multiple choice (MCQ) type question:</li>
            </ol>
            <ul className="tcs-bullet-list">
              <li>To select your answer, click on one of the option buttons.</li>
              <li>To change your answer, click another desired option button.</li>
              <li>To save your answer, you MUST click on <strong>Save &amp; Next</strong>.</li>
              <li>To deselect a chosen answer, click on the chosen option again or click on the <strong>Clear Response</strong> button.</li>
            </ul>
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
        <button className="tcs-next-btn" onClick={handleProceed}>Next &gt;</button>
      </div>
    </div>
  );
};

export default InstructionScreen;

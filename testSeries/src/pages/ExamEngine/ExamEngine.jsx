import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './ExamEngine.css';

const ExamEngine = () => {
  const { testId } = useParams();
  const id = testId; // Align params mapping
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  // Retrieve interface preferences
  const { selectedInterface, secondaryLanguage } = location.state || { 
    selectedInterface: 'TCS Interface', 
    secondaryLanguage: 'English' 
  };

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [reviewStatus, setReviewStatus] = useState({}); // { questionId: true/false }
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTimeLeft, setInitialTimeLeft] = useState(0);
  const [violationCount, setViolationCount] = useState(0);

  // FETCH TEST & RESTORE STATE
  useEffect(() => {
    if (!authLoading && !user) {
      alert("Please login to take the test.");
      navigate('/login');
      return;
    }

    const fetchTestData = async () => {
      try {
        const res = await api.get(`/tests/${id}/attempt`);
        setTest(res.data.test);
        setQuestions(res.data.questions);
        
        // Parse duration string (e.g. "90 Mins" -> 90)
        const durationStr = res.data.test.duration;
        const minutes = parseInt(durationStr.match(/\d+/)?.[0] || "60");
        const totalSeconds = minutes * 60;
        
        // 💾 RESTORE AUTO-SAVED DRAFT IF EXISTS
        const savedDraft = localStorage.getItem(`exam_draft_${id}`);
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            setAnswers(parsed.answers || {});
            setReviewStatus(parsed.reviewStatus || {});
            setCurrentIndex(parsed.currentIndex || 0);
            
            if (parsed.timeLeft && parsed.timeLeft > 0) {
              setTimeLeft(parsed.timeLeft);
            } else {
              setTimeLeft(totalSeconds);
            }
          } catch (e) {
            console.error("Failed to restore exam draft state:", e);
            setTimeLeft(totalSeconds);
          }
        } else {
          setTimeLeft(totalSeconds);
        }
        
        setInitialTimeLeft(totalSeconds);
      } catch (error) {
        console.error(error);
        alert("Failed to load test");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchTestData();
    }
  }, [id, user, authLoading, navigate]);

  // 💾 SAVE DRAFT PERIODICALLY (Timer & State protection)
  useEffect(() => {
    if (test && !loading) {
      const draftState = {
        answers,
        reviewStatus,
        timeLeft,
        currentIndex
      };
      localStorage.setItem(`exam_draft_${id}`, JSON.stringify(draftState));
    }
  }, [answers, reviewStatus, timeLeft, currentIndex, test, loading, id]);

  const handleSubmit = useCallback(async (isAuto = false) => {
    if (!isAuto && !window.confirm("Are you sure you want to submit the test?")) return;
    
    try {
      setLoading(true);
      const timeTakenSeconds = initialTimeLeft - timeLeft;
      const h = Math.floor(timeTakenSeconds / 3600);
      const m = Math.floor((timeTakenSeconds % 3600) / 60);
      const s = timeTakenSeconds % 60;
      const durationFormatted = `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;

      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex
      }));
      
      const res = await api.post(`/tests/${id}/submit`, { 
        answers: formattedAnswers, 
        duration: durationFormatted,
        violations: violationCount // Pushing proctoring warnings to backend db
      });

      // Clear draft save state on successful submission
      localStorage.removeItem(`exam_draft_${id}`);
      navigate(`/result/${res.data.resultId}`);
    } catch (error) {
      console.error(error);
      if (!isAuto) alert("Failed to submit test");
      setLoading(false);
    }
  }, [answers, id, navigate, initialTimeLeft, timeLeft, violationCount]);

  // 🛡️ PROCTORING (Window switcher anti-cheating checks)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !loading && test) {
        handleViolation();
      }
    };

    const handleWindowBlur = () => {
      if (!loading && test) {
        handleViolation();
      }
    };

    const handleViolation = () => {
      setViolationCount(prev => {
        const newCount = prev + 1;
        if (newCount === 1) {
          alert("⚠️ WARNING: Window switching detected! This is your FIRST warning. Switching again will result in AUTOMATIC SUBMISSION.");
        } else if (newCount >= 2) {
          alert("🚫 SECOND VIOLATION: Test is being auto-submitted due to cheating policy.");
          handleSubmit(true);
        }
        return newCount;
      });
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [loading, test, handleSubmit]);

  // Timer interval countdown
  useEffect(() => {
    if (timeLeft <= 0 && !loading && test) {
      handleSubmit(true);
      return;
    }
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft, loading, test, handleSubmit]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex) => {
    const qId = questions[currentIndex]._id;
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const clearResponse = () => {
    const qId = questions[currentIndex]._id;
    const newAnswers = { ...answers };
    delete newAnswers[qId];
    setAnswers(newAnswers);
  };

  const toggleReview = () => {
    const qId = questions[currentIndex]._id;
    setReviewStatus(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const getQuestionStatusClass = (qId) => {
    const isAnswered = answers[qId] !== undefined;
    const isReviewed = reviewStatus[qId];
    
    if (isReviewed) return 'status-review';
    if (isAnswered) return 'status-answered';
    return 'status-unanswered';
  };

  if (loading) return <div className="exam-loading">Preparing your exam...</div>;
  if (!questions.length) return <div className="exam-loading">No questions found for this test.</div>;

  const currentQ = questions[currentIndex];
  const candidateName = user?.name || 'dhanshri';

  // Dynamic grouping of subjects for sectional navigation tabs
  const subjects = [...new Set(questions.map(q => q.subject || "General Awareness"))];
  const currentSubject = currentQ.subject || "General Awareness";

  // Dynamic theme class names
  const interfaceClass = selectedInterface.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`exam-engine-layout ${interfaceClass}`}>
      
      {/* ====================================================
          TCS INTERFACE STYLE RENDERING
          ==================================================== */}
      {selectedInterface === 'TCS Interface' && (
        <>
          <header className="tcs-header">
            <div className="tcs-title-bar">{test.title}</div>
            <div className="tcs-top-meta">
              <div className="tcs-timer-box">
                Time Left: <span className="timer-val">{formatTime(timeLeft)}</span>
              </div>
              <div className="tcs-candidate-tag">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=e2e8f0`} alt="Avatar" className="tcs-avatar-mini" />
                <span>{candidateName}</span>
              </div>
            </div>
          </header>

          {/* Section Tabs under header */}
          <div className="tcs-sections-strip">
            {subjects.map((subj) => (
              <button
                key={subj}
                className={`tcs-section-btn ${currentSubject === subj ? 'active' : ''}`}
                onClick={() => {
                  const firstIdx = questions.findIndex(q => (q.subject || "General Awareness") === subj);
                  if (firstIdx !== -1) setCurrentIndex(firstIdx);
                }}
              >
                {subj}
              </button>
            ))}
          </div>

          <div className="exam-body">
            <div className="exam-main tcs-layout-main">
              <div className="tcs-question-title-row">
                <h3>Question No. {currentIndex + 1}</h3>
                <div className="tcs-marks-badges">
                  <span className="pos">Marks: +{currentQ.marks}</span>
                  <span className="neg">Negative: -{currentQ.negativeMarks}</span>
                </div>
              </div>

              <div className="tcs-question-body">
                <div className="q-text" dangerouslySetInnerHTML={{ __html: currentQ.questionText }}></div>
                <div className="tcs-options-list">
                  {currentQ.options.map((opt, idx) => (
                    <label key={idx} className={`tcs-option-card ${answers[currentQ._id] === idx ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name={`q-${currentQ._id}`} 
                        checked={answers[currentQ._id] === idx}
                        onChange={() => handleOptionSelect(idx)}
                      />
                      <span className="opt-idx">{String.fromCharCode(65 + idx)})</span>
                      <span className="opt-desc" dangerouslySetInnerHTML={{ __html: opt }}></span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="tcs-actions-footer">
                <div className="left-footer">
                  <button className="tcs-action-btn grey" onClick={clearResponse}>Clear Response</button>
                  <button className="tcs-action-btn purple" onClick={toggleReview}>
                    {reviewStatus[currentQ._id] ? 'Unmark Review' : 'Mark for Review & Next'}
                  </button>
                </div>
                <div className="right-footer">
                  <button 
                    className="tcs-action-btn green" 
                    onClick={() => {
                      if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
                    }}
                  >
                    Save & Next
                  </button>
                </div>
              </div>
            </div>

            <aside className="exam-sidebar tcs-sidebar-layout">
              <div className="tcs-profile-card">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=2c3e50&color=fff&size=80`} alt="Candidate" className="tcs-avatar-large" />
                <div className="tcs-name-info">
                  <h4>{candidateName}</h4>
                  <p>Language: {secondaryLanguage}</p>
                </div>
              </div>

              <div className="tcs-palette-block">
                <div className="palette-header">Question Palette</div>
                <div className="palette-grid">
                  {questions.map((q, idx) => (
                    <button
                      key={q._id}
                      className={`tcs-palette-shape ${getQuestionStatusClass(q._id)} ${currentIndex === idx ? 'current' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tcs-legend-grid">
                <div className="legend-row"><span className="shape shape-answered"></span> Answered</div>
                <div className="legend-row"><span className="shape shape-unanswered"></span> Not Answered</div>
                <div className="legend-row"><span className="shape shape-review"></span> Marked for Review</div>
              </div>

              <button className="tcs-submit-trigger" onClick={() => handleSubmit(false)}>
                Submit Exam
              </button>
            </aside>
          </div>
        </>
      )}

      {/* ====================================================
          IBPS INTERFACE STYLE RENDERING
          ==================================================== */}
      {selectedInterface === 'IBPS Interface' && (
        <>
          <header className="ibps-top-nav">
            <div className="ibps-logo-section">🏦 IBPS Exam Portal</div>
            <div className="ibps-candidate-detail">
              <span>Candidate Name: <strong>{candidateName}</strong></span>
              <span>| Subject: <strong>{currentSubject}</strong></span>
              <span className="ibps-timer-pill">Timer: {formatTime(timeLeft)}</span>
            </div>
          </header>

          <div className="ibps-sections-tabs">
            {subjects.map((subj) => (
              <button
                key={subj}
                className={`ibps-tab ${currentSubject === subj ? 'active' : ''}`}
                onClick={() => {
                  const firstIdx = questions.findIndex(q => (q.subject || "General Awareness") === subj);
                  if (firstIdx !== -1) setCurrentIndex(firstIdx);
                }}
              >
                {subj}
              </button>
            ))}
          </div>

          <div className="exam-body">
            <div className="exam-main ibps-main-layout">
              <div className="ibps-q-meta">
                <span className="ibps-q-no">Section Question No. {currentIndex + 1}</span>
                <span className="ibps-q-weightage">[Right: +{currentQ.marks} | Wrong: -{currentQ.negativeMarks}]</span>
              </div>

              <div className="ibps-question-block">
                <p className="ibps-question-text" dangerouslySetInnerHTML={{ __html: currentQ.questionText }}></p>
                <div className="ibps-options-group">
                  {currentQ.options.map((opt, idx) => (
                    <label key={idx} className={`ibps-opt-item ${answers[currentQ._id] === idx ? 'checked' : ''}`}>
                      <input 
                        type="radio" 
                        name={`q-${currentQ._id}`} 
                        checked={answers[currentQ._id] === idx}
                        onChange={() => handleOptionSelect(idx)}
                      />
                      <span className="ibps-opt-label">{String.fromCharCode(65 + idx)}</span>
                      <span dangerouslySetInnerHTML={{ __html: opt }}></span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="ibps-bottom-actions">
                <button className="ibps-btn secondary" onClick={clearResponse}>Clear Response</button>
                <button className="ibps-btn secondary" onClick={toggleReview}>
                  {reviewStatus[currentQ._id] ? 'Unmark Review' : 'Mark for Review'}
                </button>
                <button 
                  className="ibps-btn primary"
                  onClick={() => {
                    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
                  }}
                >
                  Save & Next
                </button>
              </div>
            </div>

            <aside className="exam-sidebar ibps-sidebar-layout">
              <div className="ibps-photo-wrapper">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=3b82f6&color=fff&size=100`} alt="Candidate" />
                <span className="ibps-name-tag">{candidateName}</span>
              </div>

              <div className="ibps-palette-wrapper">
                <h5 className="ibps-sidebar-title">Question Grid</h5>
                <div className="ibps-grid">
                  {questions.map((q, idx) => (
                    <button
                      key={q._id}
                      className={`ibps-grid-btn ${getQuestionStatusClass(q._id)} ${currentIndex === idx ? 'current' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ibps-legend">
                <div><span className="ibps-indicator ans"></span> Answered</div>
                <div><span className="ibps-indicator not-ans"></span> Unanswered</div>
                <div><span className="ibps-indicator review"></span> For Review</div>
              </div>

              <button className="ibps-submit-btn" onClick={() => handleSubmit(false)}>
                SUBMIT EXAM
              </button>
            </aside>
          </div>
        </>
      )}

      {/* ====================================================
          RANKU1 (PREMIUM MODERN GRAPHICS) INTERFACE RENDER
          ==================================================== */}
      {(selectedInterface !== 'TCS Interface' && selectedInterface !== 'IBPS Interface') && (
        <>
          <header className="exam-header ranku1-header">
            <div className="exam-title">
              <span>⭐ RankU1 Premium Engine</span>
              <span className="subtitle">| {test.title}</span>
            </div>
            
            {/* Dynamic Subject Sections right in the middle */}
            <div className="ranku1-subjects-menu">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  className={`ranku1-subject-pill ${currentSubject === subj ? 'active' : ''}`}
                  onClick={() => {
                    const firstIdx = questions.findIndex(q => (q.subject || "General Awareness") === subj);
                    if (firstIdx !== -1) setCurrentIndex(firstIdx);
                  }}
                >
                  {subj}
                </button>
              ))}
            </div>

            <div className="exam-timer ranku1-timer-card">
              Time Left: <span>{formatTime(timeLeft)}</span>
            </div>
          </header>

          <div className="exam-body">
            <main className="exam-main ranku1-glass">
              <div className="question-header">
                <h3>Question {currentIndex + 1} of {questions.length}</h3>
                <div className="marks-info">
                  <span className="positive-marks">+{currentQ.marks} Correct</span>
                  {currentQ.negativeMarks > 0 && <span className="negative-marks">-{currentQ.negativeMarks} Wrong</span>}
                </div>
              </div>
              
              <div className="question-text" dangerouslySetInnerHTML={{ __html: currentQ.questionText }}></div>
              
              <div className="options-container ranku1-options">
                {currentQ.options.map((opt, idx) => (
                  <label 
                    key={idx} 
                    className={`option-label ${answers[currentQ._id] === idx ? 'selected' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name={`q-${currentQ._id}`} 
                      checked={answers[currentQ._id] === idx}
                      onChange={() => handleOptionSelect(idx)}
                    />
                    <span className="option-check-bullet">{String.fromCharCode(65 + idx)}</span>
                    <span className="option-text" dangerouslySetInnerHTML={{ __html: opt }}></span>
                  </label>
                ))}
              </div>

              <div className="action-buttons">
                <button className="btn-secondary" onClick={clearResponse}>Clear Selection</button>
                <button className="btn-secondary" onClick={toggleReview}>
                  {reviewStatus[currentQ._id] ? 'Unmark Flag' : '📑 Mark for Review'}
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
                  }}
                >
                  Save & Next &rarr;
                </button>
              </div>
            </main>

            <aside className="exam-sidebar ranku1-sidebar">
              <div className="palette-header">Question Palette</div>
              <div className="palette-grid">
                {questions.map((q, idx) => (
                  <button
                    key={q._id}
                    className={`palette-btn ${getQuestionStatusClass(q._id)} ${currentIndex === idx ? 'current' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              
              <div className="palette-legend">
                <div className="legend-item"><span className="box status-answered"></span> Answered</div>
                <div className="legend-item"><span className="box status-unanswered"></span> Unattempted</div>
                <div className="legend-item"><span className="box status-review"></span> Marked Review</div>
              </div>
              
              <button className="btn-submit" onClick={() => handleSubmit(false)}>
                🚀 Submit Test Series
              </button>
            </aside>
          </div>
        </>
      )}

    </div>
  );
};

export default ExamEngine;

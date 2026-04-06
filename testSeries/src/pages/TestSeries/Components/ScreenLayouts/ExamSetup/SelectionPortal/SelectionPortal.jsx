//SelectionPortal.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../Common/BackButton/BackButtonComponent';
import './SelectionPortal.css';

const SelectionPortal = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [selectedInterface, setSelectedInterface] = useState(null);
  const [secondaryLanguage, setSecondaryLanguage] = useState('English');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const interfaceOptions = [
    {
      id: 'tcs',
      name: 'TCS Interface',
      description: 'Standard interface used in SSC and other major exams.',
      icon: '💻',
      color: '#3b82f6'
    },
    {
      id: 'ibps',
      name: 'IBPS Interface',
      description: 'Dedicated interface for Bank, Insurance and IBPS exams.',
      icon: '🏦',
      color: '#10b981'
    },
    {
      id: 'eduquity',
      name: 'Eduquity Interface',
      description: 'Common interface for Railway and some PSU exams.',
      icon: '🚂',
      color: '#f59e0b'
    },
    {
      id: 'ranku1',
      name: 'RankU1 Interface',
      description: 'Our premium, feature-rich experimental interface.',
      icon: '⭐',
      color: '#facc15'
    }
  ];

  const languageOptions = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali'];

  const handleSelectInterface = (interfaceId) => {
    setSelectedInterface(interfaceId);
  };

  const handleStartExam = () => {
    if (!selectedInterface) {
      alert('Please select an interface to continue');
      return;
    }
    if (!termsAccepted) {
      alert('Please accept the terms to begin the exam');
      return;
    }
    
    // Store selected interface and language
    localStorage.setItem('selectedExamInterface', selectedInterface);
    localStorage.setItem('secondaryLanguage', secondaryLanguage);
    localStorage.setItem('termsAccepted', 'true');
    
    // Navigate to no-questions screen (temporary - will be replaced with actual exam)
    navigate('/exam/no-questions');
  };

  const handleBack = () => {
    navigate(-1);
  };

  // If not logged in, show nothing while redirecting
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="selection-portal-container">
      <div className="selection-portal">
        {/* Back Button using existing component */}
        <div className="portal-back-wrapper">
          <BackButton />
        </div>

        {/* Header */}
        <div className="portal-header">
          <h1 className="portal-title">Selection Portal</h1>
          <p className="portal-description">
            Optimizing your digital workspace. Choose an interface that aligns with your preferred exam environment.
          </p>
        </div>

        {/* Interface Options Grid */}
        <div className="interface-grid">
          {interfaceOptions.map((option) => (
            <div
              key={option.id}
              className={`interface-card ${selectedInterface === option.id ? 'selected' : ''}`}
              onClick={() => handleSelectInterface(option.id)}
              style={{ '--card-accent': option.color }}
            >
              <div className="interface-icon" style={{ backgroundColor: `${option.color}1a`, color: option.color }}>
                <span className="icon-emoji">{option.icon}</span>
              </div>
              <h3 className="interface-name">{option.name}</h3>
              <p className="interface-description">{option.description}</p>
              {selectedInterface === option.id && (
                <div className="selected-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Secondary Language Section */}
        <div className="language-section">
          <label className="language-label">
            <span className="language-text">Secondary Language:</span>
            <select 
              className="language-select"
              value={secondaryLanguage}
              onChange={(e) => setSecondaryLanguage(e.target.value)}
            >
              {languageOptions.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Terms Acceptance */}
        <div className="terms-section">
          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span className="terms-text">
              I am ready to accept the terms and begin the exam.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="portal-actions">
          <button className="portal-back-action" onClick={handleBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <button 
            className={`portal-start-btn ${selectedInterface && termsAccepted ? 'active' : ''}`}
            onClick={handleStartExam}
            disabled={!selectedInterface || !termsAccepted}
          >
            START EXAM
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionPortal;
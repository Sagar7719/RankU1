import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './InterfaceSelection.css';

const InterfaceSelection = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const { user } = useAuth();

  const [selectedInterface, setSelectedInterface] = useState('TCS Interface');
  const [secondaryLanguage, setSecondaryLanguage] = useState('English');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const interfaces = [
    { id: 'TCS Interface', title: 'TCS Interface', subtitle: 'Standard interface used in SSC and other major exams.', icon: '💻' },
    { id: 'IBPS Interface', title: 'IBPS Interface', subtitle: 'Dedicated interface for Bank, Insurance and IBPS exams.', icon: '🏦' },
    { id: 'Eduquity Interface', title: 'Eduquity Interface', subtitle: 'Common interface for Railway and some PSU exams.', icon: '🚂' },
    { id: 'RankU1 Interface', title: 'RankU1 Interface', subtitle: 'Our premium, feature-rich experimental interface.', icon: '⭐' },
  ];

  const handleStartExam = () => {
    if (acceptedTerms) {
      if (!user) {
        alert("Please login to start the test.");
        navigate('/login');
        return;
      }
      navigate(`/test-instructions/${testId}`, { 
        state: { selectedInterface, secondaryLanguage } 
      });
    }
  };

  return (
    <div className="selectionPortalContainer">
      <div className="portalHeader">
        <h1>Selection Portal</h1>
        <p>Optimizing your digital workspace. Choose an interface that aligns with your preferred exam environment.</p>
      </div>

      <div className="interfacesGrid">
        {interfaces.map((intf) => (
          <div
            key={intf.id}
            className={`interfaceCard ${selectedInterface === intf.id ? 'selected' : ''}`}
            onClick={() => setSelectedInterface(intf.id)}
          >
            {selectedInterface === intf.id && (
              <div className="checkIcon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#3b82f6"/>
                  <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            <div className="interfaceIconWrap">{intf.icon}</div>
            <h3>{intf.title}</h3>
            <p>{intf.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="portalDivider"></div>

      <div className="languageSelection">
        <label>Secondary Language:</label>
        <select
          value={secondaryLanguage}
          onChange={(e) => setSecondaryLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Marathi">Marathi</option>
        </select>
      </div>

      <div className="portalDivider"></div>

      <div className="termsCheck">
        <label>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          I am ready to accept the terms and begin the exam.
        </label>
      </div>

      <div className="portalActions">
        <button className="backActionBtn" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <button
          className={`startActionBtn ${acceptedTerms ? 'active' : ''}`}
          disabled={!acceptedTerms}
          onClick={handleStartExam}
        >
          START EXAM &rarr;
        </button>
      </div>
    </div>
  );
};

export default InterfaceSelection;

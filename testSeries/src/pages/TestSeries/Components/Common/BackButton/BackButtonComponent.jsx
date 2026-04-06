// C:\Users\Admin\Desktop\RankU1\testSeries\src\pages\TestSeries\Components\Common\BackButton\BackButtonComponent.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/search');
  };

  return (
    <div className="tsd-breadcrumb">
      <button 
        className="tsd-back-btn"
        onClick={handleBack}
        aria-label="Back to Test Series"
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
          aria-hidden="true"
        >
          <path d="m12 19-7-7 7-7"></path>
          <path d="M19 12H5"></path>
        </svg>
        <span>Back to Test Series</span>
      </button>
    </div>
  );
};

export default BackButton;
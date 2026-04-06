// TestCardsWrapper.js
import React from 'react';
import './TestCardsWrapper.css';

const TestCardsWrapper = ({ children }) => {
  return (
    <div className="test-cards-wrapper">
      {children}
    </div>
  );
};

export default TestCardsWrapper;
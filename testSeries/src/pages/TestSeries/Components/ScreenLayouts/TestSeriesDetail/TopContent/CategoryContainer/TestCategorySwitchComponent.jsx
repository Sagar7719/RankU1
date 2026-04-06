// src/TestCategorySwitch.js
import React from 'react';
import './TestCategorySwitch.css';

const TestCategorySwitchComponent = ({ activeCategory, onCategoryChange, testData }) => {
  const TestCategory = [
    { name: 'Live Exams', icon: 'clock' },
    { name: 'Mock Tests', icon: 'play-circle' },
    { name: 'PYQs', icon: 'history' },
    { name: 'Sectional', icon: 'grid' },
    { name: 'Topicwise', icon: 'list' }
  ];

  // SVG icon components
  const Icons = {
    clock: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    'play-circle': () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="10 8 16 12 10 16 10 8"></polygon>
      </svg>
    ),
    history: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
        <path d="M12 7v5l4 2"></path>
      </svg>
    ),
    grid: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
        <path d="M3 9h18"></path>
        <path d="M3 15h18"></path>
        <path d="M9 3v18"></path>
        <path d="M15 3v18"></path>
      </svg>
    ),
    list: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h.01"></path>
        <path d="M3 18h.01"></path>
        <path d="M3 6h.01"></path>
        <path d="M8 12h13"></path>
        <path d="M8 18h13"></path>
        <path d="M8 6h13"></path>
      </svg>
    )
  };

  const getCategoryCount = (categoryName) => {
    return testData[categoryName]?.length || 0;
  };

  return (
    <div className="tsd-tabs-container">
      <div className="tsd-tabs">
        {TestCategory.map((category) => {
          const count = getCategoryCount(category.name);
          const IconComponent = Icons[category.icon];
          const isActive = activeCategory === category.name;
          
          return (
            <button
              key={category.name}
              type="button"
              className={`category-btn ${isActive ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.name)}
            >
              {IconComponent && <IconComponent />}
              <span>
                {category.name}
                {count > 0 && ` (${count})`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TestCategorySwitchComponent;
// EmptyTestFilterComponent.js
import React from 'react';
import './EmptyTestFilter.css'; // Corrected file name
import { AlertCircle } from 'lucide-react'; // or whatever icon you're using

const EmptyTestFilterComponent = ({ category, onCategoryChange, testData }) => {
  // Get categories that have tests (excluding the current empty category)
  const categoriesWithTests = Object.entries(testData)
    .filter(([cat, tests]) => cat !== category && tests.length > 0)
    .map(([cat, tests]) => ({ name: cat, count: tests.length }));

  // Play Circle SVG Icon (without lucide-react)
  const PlayCircleIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="48" 
      height="48" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="empty-icon"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polygon points="10 8 16 12 10 16 10 8"></polygon>
    </svg>
  );

  // If no categories have any tests at all
  if (categoriesWithTests.length === 0) {
    return (
      <div className="empty-filter-wrapper">
        <div className="empty-filter-card">
          <PlayCircleIcon />
          <h3>No {category} tests found</h3>
          <p>We haven't uploaded any tests for this test series yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="empty-filter-wrapper">
      <div className="empty-filter-card">
        <PlayCircleIcon />
        <h3>No {category} tests found</h3>
        <p>We haven't uploaded tests for this specific category yet.</p>
        
        {/* Other categories section */}
        <div className="other-categories-container">
          <p className="other-categories-text">
            However, we found tests in other categories:
          </p>
          <div className="categories-buttons">
            {categoriesWithTests.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onCategoryChange(cat.name)}
                className="category-switch-btn"
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyTestFilterComponent;
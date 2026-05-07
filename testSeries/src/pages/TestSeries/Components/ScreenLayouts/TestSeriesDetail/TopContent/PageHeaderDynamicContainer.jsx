//C:\Users\Admin\Desktop\RankU1\testSeries\src\pages\TestSeries\Components\ScreenLayouts\TestSeriesDetail\TopContent\DetailHeader\PageHeaderDynamicComponent.jsx

import React from 'react';import{Book}from 'lucide-react';
import './PageHeaderDynamicContainer.css';

const PageHeaderDynamicComponent = ({ 
  title, 
  totalTests = 0,  
  freeMocks = 0     
}) => {
  // Fixed description for all exams
  const description = 'Master your preparation with our exam-relevant mock tests.';
  
  return (   
    <header className="tsd-hero">
      <div className="tsd-hero-left">
        <div className="tsd-series-icon">
          <Book className="tsd-icon" />
        </div>
        <div>
          <h1 className="tsd-title">{title}</h1>
          <p className="tsd-sub">{description}</p>
        </div>
      </div>
      <div className="tsd-hero-stats">
        <div className="tsd-stat">
          <span className="tsd-stat-val">{totalTests}</span>
          <span className="tsd-stat-label">Total Tests</span>
        </div>
        <div className="tsd-stat">
          <span className="tsd-stat-val">{freeMocks}</span>
          <span className="tsd-stat-label">Free Mocks</span>
        </div>
      </div>
    </header>
  );
};

export default PageHeaderDynamicComponent;
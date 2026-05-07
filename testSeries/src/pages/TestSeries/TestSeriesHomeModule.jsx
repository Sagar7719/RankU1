// C:\Users\Admin\Desktop\RankU1\testSeries\src\pages\TestSeries\TestSeriesHome.jsx
import React, { useState } from 'react';
import HeroSection from './Components/ScreenLayouts/Home/HeroSection';
import SearchComponent from './Components/ScreenLayouts/Home/SearchComponent';
import SearchResultsComponent from './Components/ScreenLayouts/Home/SearchResultsComponent';
import { getAllSeries, TestsByCategory } from './Data/TestSeriesData'; 

const TestSeriesHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeExamCategory, setActiveExamCategory] = useState('All');
  
  // Get all series as a flat array for display
  const allSeries = getAllSeries();

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleExamCategorySelect = (category) => {
    setActiveExamCategory(category);
  };

  return (
    <>
      <HeroSection />
       <SearchComponent 
        onSearch={handleSearch}
        onExamCategorySelect={handleExamCategorySelect}
        activeExamCategory={activeExamCategory}
      />
    <SearchResultsComponent
        allSeries={allSeries} 
        testsByCategory={TestsByCategory} // Pass the full data if needed
        searchTerm={searchTerm}
        activeExamCategory={activeExamCategory}
      /> 
    </>
  );
};

export default TestSeriesHome;
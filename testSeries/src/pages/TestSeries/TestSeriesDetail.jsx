// C:\Users\Admin\Desktop\RankU1\testSeries\src\pages\TestSeries\TestSeriesDetail.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // Add useLocation
import BackButton from './Components/Common/BackButton/BackButtonComponent';
import PageHeaderDynamicComponent from './Components/ScreenLayouts/TestSeriesDetail/TopContent/DetailHeader/PageHeaderDynamicComponent';
import TestCategorySwitchComponent from './Components/ScreenLayouts/TestSeriesDetail/TopContent/CategoryContainer/TestCategorySwitchComponent';
import EmptyTestFilterComponent from './Components/ScreenLayouts/TestSeriesDetail/TestCatalog/EmptyCatalog/EmptyTestFilterComponent';
import FreeTestCardComponent from './Components/ScreenLayouts/TestSeriesDetail/TestCatalog/TestCards/AuthDependent/FreeTest/FreeTestCardComponent';
import LockedTestCardComponent from './Components/ScreenLayouts/TestSeriesDetail/TestCatalog/TestCards/AuthDependent/LoginRequired/LockedTestCardComponent';
import ScheduledTestCardComponent from './Components/ScreenLayouts/TestSeriesDetail/TestCatalog/TestCards/TimeDependent/Scheduled/ScheduledTestCardComponent';
import TestAvailableSoonComponent from './Components/ScreenLayouts/TestSeriesDetail/TestCatalog/TestCards/TimeDependent/NotAvailable/TestAvailableSoonComponent';
import { getSeriesByTitle } from './Data/TestSeriesData';

const TestSeriesDetail = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();  // Get location to access state
  const [activeCategory, setActiveCategory] = useState('Mock Tests');
  
  // Get series data from location state OR fallback to URL param
  let seriesData = location.state?.series;
  
  // Fallback: If no state (direct URL access), try to get from title param
  if (!seriesData && location.state?.series === undefined) {
    // Optional: Handle direct URL access
    // You can redirect to home or show error
    return (
      <div className="testseries-detail-container">
        <BackButton />
        <div className="empty-state">
          <h5>Invalid Access</h5>
          <p className="text-muted">Please navigate from the test series home page</p>
          <button onClick={() => navigate('/testseries')}>Go Back Home</button>
        </div>
      </div>
    );
  }
  
  if (!seriesData) {
    return (
      <div className="testseries-detail-container">
        <BackButton />
        <div className="empty-state">
          <h5>Test series not found</h5>
          <p className="text-muted">The requested series doesn't exist</p>
        </div>
      </div>
    );
  }

  // Now we need to get the full test data from the original source
  // Since seriesData from state only contains summary info, fetch full data
  const fullSeriesData = getSeriesByTitle(seriesData.SeriesTitle);
  
  if (!fullSeriesData) {
    return (
      <div className="testseries-detail-container">
        <BackButton />
        <div className="empty-state">
          <h5>Test series not found</h5>
          <p className="text-muted">The series "{seriesData.SeriesTitle}" doesn't exist</p>
        </div>
      </div>
    );
  }

  const { tests, ExamCategory } = fullSeriesData;
 
  // Organize tests by TestCategory
  const testData = {
    'Live Exams': tests.filter(test => test.TestCategory?.includes('Live Exams')),
    'Mock Tests': tests.filter(test => test.TestCategory?.includes('Mock Tests')),
    'PYQs': tests.filter(test => test.TestCategory?.includes('PYQs')),
    'Sectional': tests.filter(test => test.TestCategory?.includes('Sectional')),
    'Topicwise': tests.filter(test => test.TestCategory?.includes('Topicwise'))
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  const handleButtonClick = (test) => {
    switch(test.status) {
      case 'scheduled':
        console.log('Scheduled test - not available yet:', test.TestTitle);
        break;
      case 'availableSoon':
        console.log('Test available soon:', test.TestTitle);
        break;
      case 'locked':
        console.log('Login to unlock test:', test.TestTitle);
        break;
      case 'free':
        // Free test navigation is handled inside FreeTestCardComponent
        break;
      default:
        console.log('Unknown test status:', test);
    }
  };
  
  const currentTests = testData[activeCategory] || [];
  const hasTests = tests.length > 0;
  
  // Calculate stats
  const totalTests = tests.length;
  const freeMocks = tests.filter(test => test.status === 'free').length;

  return (
    <div className="testseries-detail-container">
      <BackButton />
      <PageHeaderDynamicComponent 
        title={fullSeriesData.SeriesTitle}
        totalTests={totalTests}
        freeMocks={freeMocks}
      />

      <TestCategorySwitchComponent
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        testData={testData}
      />

      {hasTests && currentTests.length > 0 && (
        <div className="tests-list">
          {currentTests.map((test, index) => {
            const testWithSeries = {
              ...test,
              SeriesTitle: fullSeriesData.SeriesTitle
            };
            switch(test.status) {
              case 'scheduled':
                return (
                  <ScheduledTestCardComponent    
                    test={testWithSeries} 
                    key={`${test.TestTitle}-${index}`}
                    onButtonClick={handleButtonClick}
                  />
                );
              case 'availableSoon':
                return (
                  <TestAvailableSoonComponent
                    key={`${test.TestTitle}-${index}`}
                    test={testWithSeries}
                    onButtonClick={handleButtonClick}
                  />
                );
              case 'locked':
                return (
                  <LockedTestCardComponent
                    key={`${test.TestTitle}-${index}`}
                    test={testWithSeries}
                    ExamCategory={ExamCategory} 
                    isLoggedIn={isLoggedIn}
                    onButtonClick={handleButtonClick}
                  />
                );
              case 'free':
                return (
                  <FreeTestCardComponent 
                    key={`${test.TestTitle}-${index}`} 
                    test={testWithSeries}
                    ExamCategory={ExamCategory}
                    isLoggedIn={isLoggedIn}
                    onButtonClick={handleButtonClick}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      )}

      {/* Show EmptyTestFilterComponent when current category has no tests */}
      {currentTests.length === 0 && (
        <EmptyTestFilterComponent
          category={activeCategory}
          onCategoryChange={handleCategoryChange}
          testData={testData}
        />
      )}

      {!hasTests && (
        <div className="no-tests-state">
          <div className="empty-state">
            <h5>No tests available for {fullSeriesData.SeriesTitle}</h5>
            <p className="text-muted">This test series doesn't have any tests yet</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSeriesDetail;
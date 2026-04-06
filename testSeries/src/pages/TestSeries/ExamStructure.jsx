//C:\Users\Admin\Desktop\RankU1\testSeries\src\pages\TestSeries\ExamStructure.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SelectionPortal from './Components/ScreenLayouts/ExamSetup/SelectionPortal/SelectionPortal'
import NoQuestionsScreen from './Components/ScreenLayouts/ExamSetup/NoQuestionsScreen';

const ExamStructure = ({ isLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse the current path to determine what to render
  const getCurrentView = () => {
    const path = location.pathname.replace('/testseries/exam', '');
    
    if (path === '/selection' || path === '/selection/') {
      return 'selection';
    }
    
    if (path === '/no-questions' || path === '/no-questions/') {
      return 'no-questions';
    }
    
    // Default to selection or redirect
    return 'selection';
  };

  const currentView = getCurrentView();

  return (
    <>
      {currentView === 'selection' && <SelectionPortal isLoggedIn={isLoggedIn} />}
      {currentView === 'no-questions' && <NoQuestionsScreen />}
    </>
  );
};

export default ExamStructure;
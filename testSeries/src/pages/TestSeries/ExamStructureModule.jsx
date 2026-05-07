//C:\Users\Admin\Desktop\RankU1\testSeries\src\pages\TestSeries\ExamStructure.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SelectionPortal from './Components/ScreenLayouts/StartExam/InterfaceSelectionPortal'
import NoQuestionsScreen from './Components/ScreenLayouts/StartExam/NoQuestionsScreen';
import InstructionScreen from './Components/ScreenLayouts/StartExam/InstructionScreen';
import LanguageSelectionScreen from './Components/ScreenLayouts/StartExam/LanguageSelectionScreen';
import McqQuestionScreen from './Components/ScreenLayouts/StartExam/McqQuestionScreen';
import PerformanceAnalysisScreen from './Components/ScreenLayouts/StartExam/PerformanceAnalysisScreen';

const ExamStructure = ({ isLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse the current path to determine what to render
  const getCurrentView = () => {
    const path = location.pathname.replace('/testseries/exam', '');
    
    if (path === '/selection' || path === '/selection/') {
      return 'selection';
    }
    
    if (path === '/instructions' || path === '/instructions/') {
      return 'instructions';
    }
    
    if (path === '/no-questions' || path === '/no-questions/') {
      return 'no-questions';
    }
    
    if (path === '/language-selection' || path === '/language-selection/') {
      return 'language-selection';
    }
    
    if (path === '/mcq-question' || path === '/mcq-question/') {
      return 'mcq-question';
    }
    
    if (path === '/performance' || path === '/performance/') {
      return 'performance';
    }
    
    // Default to selection or redirect
    return 'selection';
  };

  const currentView = getCurrentView();

  return (
    <>
      {currentView === 'selection' && <SelectionPortal isLoggedIn={isLoggedIn} />}
      {currentView === 'instructions' && <InstructionScreen isLoggedIn={isLoggedIn} />}
      {currentView === 'no-questions' && <NoQuestionsScreen />}
      {currentView === 'language-selection' && <LanguageSelectionScreen isLoggedIn={isLoggedIn} />}
      {currentView === 'mcq-question' && <McqQuestionScreen isLoggedIn={isLoggedIn} />}
      {currentView === 'performance' && <PerformanceAnalysisScreen isLoggedIn={isLoggedIn} />}
    </>
  );
};

export default ExamStructure;
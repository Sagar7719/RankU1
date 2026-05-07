// TestSeries.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TestSeriesHome from './TestSeriesHomeModule';
import TestSeriesDetail from './TestSeriesDetailModule';
import ExamStructure from './ExamStructureModule';

const TestSeries = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="bg-dark min-vh-100">
      <Routes>
        {/* Home route - /testseries */}
        <Route index element={<TestSeriesHome />} />
        
        {/* Home route with search - /testseries/search */}
        <Route path="search" element={<TestSeriesHome />} />
        
        {/* UPDATED: Detail route without URL params */}
        <Route 
          path="TestSeriesDetail" 
          element={<TestSeriesDetail isLoggedIn={isLoggedIn} />} 
        />
        
        {/* Exam route - /testseries/exam/* */}
        <Route 
          path="exam/*" 
          element={<ExamStructure isLoggedIn={isLoggedIn} />} 
        />
        
        {/* Redirect any unknown routes back to home */}
        <Route path="*" element={<Navigate to="/testseries" replace />} />
      </Routes>
    </div>
  );
};

export default TestSeries;
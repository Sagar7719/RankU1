/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const TestCard = ({ test }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    // Navigate to the test series detail page, not directly start test
    navigate(`/test-series-detail/${test._id}`);
  };

  return (
    <div className="testSeriesCard">
      {/* HEADER */}
      <div className="testCardHeader">
        <span className="cardCategoryTag">
          {test.category}
        </span>
        {test.verified && (
          <div className="cardVerifiedBadge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Verified
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="testCardBody">
        <h3 className="testCardTitle">{test.title}</h3>
        <p className="testCardSubtitle">{test.description}</p>
      </div>

      {/* FOOTER */}
      <div className="testCardFooter">
        <div className="testCardStats">
          <div className="testCardStatItem">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 17H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{test.totalTests} Tests</span>
          </div>
          <div className="testCardStatItem">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 15L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{test.duration}</span>
          </div>
        </div>

        <button className="viewDetailsBtn" onClick={handleStart}>
          View Details &gt;
        </button>
      </div>
    </div>
  );
};

export default TestCard;
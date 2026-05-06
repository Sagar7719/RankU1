import React from "react";
import { useNavigate } from "react-router-dom";
import "./SavedQuestions.css";

const SavedQuestions = () => {
  const navigate = useNavigate();

  return (
    <div className="saved-page">

      <button
        className="back-btn"
        onClick={() => navigate("/dashboard/library")}
      >
        ← Back to Profile
      </button>

      <div className="saved-header">
        <h1>Saved Questions</h1>
        <p>Revise your bookmarked important questions</p>
      </div>

      <div className="empty-box">
        <div className="empty-icon">🔖</div>
        <h2>No Saved Questions Yet</h2>
        <p>Bookmark questions during analysis to see them here.</p>
      </div>

    </div>
  );
};

export default SavedQuestions;
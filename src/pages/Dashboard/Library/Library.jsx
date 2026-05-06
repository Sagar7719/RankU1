import React from "react";
import { useNavigate } from "react-router-dom";
import "./Library.css";

const Library = () => {
  const navigate = useNavigate();
  return (



    <div className="library">

      {/* TOP CARDS */}
      <div className="top-cards">

        <div className="card"
           onClick={() => navigate("/dashboard/saved-questions")}
           >
          <div className="icon">🔖</div>
          <h2>0</h2>
          <p>Saved Questions</p>
          <span>Bookmarked for revision</span>
        </div>

        <div className="card">
          <div className="icon">🏅</div>
          <h2>1</h2>
          <p>Earned Badges</p>
          <span>Milestones achieved</span>
        </div>

        <div className="card">
          <div className="icon">🎯</div>
          <h2>4</h2>
          <p>Total Attempts</p>
          <span>Tests completed to date</span>
        </div>

      </div>


<div className="activity">

  <h3 className="activity-title">⚡ Recent Test Activity</h3>

  <div className="activity-scroll">

    {/* CARD 1 */}
       <div className="activity-card">
        <div className="card-left">
        <div className="icon-box">📄</div>

        <div>
          <h4>पोलीस भरती टेस्ट -01</h4>
          <p className="score">0</p>
          <span className="label">SCORE</span>

          <div className="progress">
            <div className="progress-bar" style={{ width: "0%" }}></div>
          </div>
        </div>
      </div>

      <span className="date">Mar 13</span>
    </div>

    {/* CARD 2 */}
         
      <div className="activity-card">
      <div className="card-left">
        <div className="icon-box">📄</div>

        <div>
          <h4>पोलीस भरती टेस्ट -02</h4>
          <p className="score">0</p>
          <span className="label">SCORE</span>

          <div className="progress">
            <div className="progress-bar" style={{ width: "0%" }}></div>
          </div>
        </div>
      </div>

      <span className="date">Mar 13</span>
    </div>

      {/* CARD 3 */}

    <div className="activity-card">
      <div className="card-left">
        <div className="icon-box">📄</div>

        <div>
          <h4>पोलीस भरती टेस्ट -03</h4>
          <p className="score">0</p>
          <span className="label">SCORE</span>

          <div className="progress">
            <div className="progress-bar" style={{ width: "0%" }}></div>
          </div>
        </div>
      </div>

      <span className="date">Mar 13</span>
    </div>



      {/* CARD 4 */}

    <div className="activity-card">
      <div className="card-left">
        <div className="icon-box">📄</div>

        <div>
          <h4>Test Attempt</h4>
          <p className="score">0</p>
          <span className="label">SCORE</span>

          <div className="progress">
            <div className="progress-bar" style={{ width: "0%" }}></div>
          </div>
        </div>
      </div>

      <span className="date">Mar 13</span>
    </div>

    {/* CARD 5 */}
    <div className="activity-card">
      <div className="card-left">
        <div className="icon-box">📄</div>

        <div>
          <h4>Test Attempt</h4>
          <p className="score">-1</p>
          <span className="label">SCORE</span>

          <div className="progress">
            <div className="progress-bar" style={{ width: "20%" }}></div>
          </div>
        </div>
      </div>

      <span className="date">Mar 3</span>
    </div>

    {/* CARD 6 */}
    <div className="activity-card">
      <div className="card-left">
        <div className="icon-box dark">📄</div>

        <div>
          <h4>Test Attempt</h4>
          <p className="score">-4</p>
          <span className="label">SCORE</span>

          <div className="progress">
            <div className="progress-bar" style={{ width: "40%" }}></div>
          </div>
        </div>
      </div>

      <span className="date">Feb 24</span>
    </div>
    </div>

  </div>

</div>
  );
};

export default Library;
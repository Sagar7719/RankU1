import React from "react";
import "./NewsPage.css";
import { Link } from "react-router-dom";
import { FaCalendar } from "react-icons/fa";
import newsImage from "../../../assets/images/news.jpg";


const NewsPage = () => {
  return (
    <div className="news-page">
      <Link to="/current-affairs">
  <button className="back-btn">
    ← Back to List
  </button>
</Link>
      <div className="news-image-container">
        <img src={newsImage} alt="news" className="news-page-image" />
        

      {/* GENERAL BUTTON */}
        <button className="general-btn">GENERAL</button>
        </div>
        
        {/* DATE */}
      <p className="news-date">
        <FaCalendar /> 30 March 2026</p>

      {/* HEADING */}
      <h1 className="news-title">
        UN Affairs General Assembly <br/> President urges Europeans to <br/>
        'stand up' for the UN
      </h1>

      {/* FULL DESCRIPTION */}
      <p className="news-text">
       Maharashtra is currently witnessing several important developments that are
  highly relevant for competitive examinations such as MPSC, SSC, Banking,   Railway, and other government exams. Recent updates include policy decisions
  taken by the state government, ongoing administrative reforms, and initiatives
  focused on education, employment, and infrastructure development.
      </p>

      <p className="news-text">
        In the education sector, special emphasis is being placed on digital learning,
  competitive exam preparation, and skill development programs for students.
  Coaching initiatives and guidance programs are helping aspirants stay updated
   with the latest exam patterns, syllabus changes, and current affairs.
      </p>

      <p className="news-text">
        These developments are crucial for aspirants as questions related to state
   government schemes, current policies, and socio-economic issues of Maharashtra
   are frequently asked in prelims and mains examinations. Staying informed about
   such current situations enhances conceptual clarity and boosts exam performance.
   </p>
</div>
  );
};

export default NewsPage;
import "./CurrentAffairs.css";
import { Link } from "react-router-dom";
import newsImage from "../../assets/images/news.jpg";
import {FaBolt,  FaAward, FaArrowUp, FaCalendarAlt } from "react-icons/fa";


const CurrentAffairs = () => {
  const shortText =
  "Maharashtra is currently witnessing several important developments that are highly relevant for competitive examinations such as MPSC, SSC, Banking and Railway exams.....";

   return (
 <section className="middle-section">
      {/* Pre Heading */}
       
     <button className="pre-heading-btn">
      <FaBolt /> Premium Daily Dose
      </button>
   
       {/* Main Heading */}
       <h2 className="main-heading">
        Stay Informed With 
       <span className="highlight-text"> Daily Dose & News</span>
       </h2>

      {/* Description */}
       <p className="heading-description">
        Experience the most exam-relevant news platform. Curated by experts, trusted
              by thousands of aspirants.
       </p>

   <div className="stats-buttons">
  <button className="stats-btn">
    <FaArrowUp /> 500+ Daily Articles
  </button>

  <button className="stats-btn">
    <FaAward /> 10k+ Selected Candidates
  </button>
</div>

    <Link to="/news-page" className="news-card-link">
        <div className="news-card">
          
          <div className="image-wrapper">

    {/* Category Button */}
    <button className="category-btn">GENERAL</button>
      
      <img src={newsImage} alt="news" className="news-image" />

          </div>
         
   {/* CONTENT */}
   <div className="news-content">
     <p className="news-date">
  <FaCalendarAlt /> 30 MAR 2026
</p>

    <h3 className="news-heading">
      UN Affairs General Assembly<br/> President urges Europeans to <br/> 'stand up' for the UN</h3>
          <p className="news-description">
           {shortText}
          </p>
        
        <span className="read-more-btn">
          Read More →
        </span>
    </div>
 </div>
 </Link>
</section>
  );
 };

export default CurrentAffairs;














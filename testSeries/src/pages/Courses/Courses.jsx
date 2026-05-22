import "./Courses.css";
import { FaBolt, FaBullseye, FaVideo, FaStar, FaSearch } from "react-icons/fa";

const Courses = () => {
  return (
    <section className="courses-section">

      {/* Pre Heading */}
      <div className="pre-heading">
        <FaBolt/> ACADEMIC EXCELLENCE HUB
     </div>
    
      {/* Heading */}
      <h1 className="main-heading">
        Elevate Your Learning <br />
        <span>Beyond Excellence</span>
      </h1>

      {/* Description */}
      <p className="description">
        Access a curated library of <strong>premium courses</strong> specially engineered
        to help you conquer competitive exams with confidence.
      </p>

      {/* Features */}
      <div className="features">
        <span><FaBullseye /> Exam Focused</span>
        <span><FaVideo /> Live Classes</span>
        <span><FaStar /> Expert Curated</span>
      </div>

      {/* Search + Filter */}
      <div className="search-filter">

        {/* LEFT */}
        <div className="search-box">
          <FaSearch className="search-icon"/>
          <input type="text" placeholder="Search Courses or Exams" />
        </div>

        {/* RIGHT */}
        <div className="filters">
          <select>
            <option>All Exams</option>
          </select>

          <select>
            <option>All Types</option>
            <option>Free</option>
            <option>Paid</option>
          </select>
        </div>
      </div>

        <div className="no-courses">
          <h2 className="no-courses-heading">No courses found</h2>
          <p className="no-courses-text">
            Try adjusting your search or filters to find what you are looking for.
          </p>
          <button className="reset-btn">Reset Filter</button>
        </div>

    </section>
  );
};

export default Courses;
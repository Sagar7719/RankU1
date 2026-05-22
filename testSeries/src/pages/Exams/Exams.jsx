import React, { useState, useEffect } from 'react';
import './Exams.css';

const Exams = () => {
  const [examsData, setExamsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/exams');
        if (response.ok) {
          const data = await response.json();
          setExamsData(data);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Filter exams based on search term (case-insensitive)
  const filteredExams = examsData.filter((exam) =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle syllabus button click (demo action)
  const handleSyllabusClick = (examName) => {
    alert(`📘 Syllabus for ${examName} will be available soon. Stay tuned for detailed PDF and topic-wise breakdown.`);
  };

  return (
    <div className="exam-directory">
      {/* Hero Section */}
      <div className="hero-section">
        <span className="hero-overline">Explore Opportunities</span>
        <h1 className="hero-title">Government Exam Directory</h1>
        <p className="hero-description">
          Get comprehensive details about every major competitive exam in India, from eligibility and
          pattern to syllabus and vacancies.
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search exams (e.g., UPSC, SSC, Banking, Railways)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        {filteredExams.length > 0 ? (
          <p>Showing <strong>{filteredExams.length}</strong> exams</p>
        ) : (
          <p>No exams found matching "<strong>{searchTerm}</strong>"</p>
        )}
      </div>

      {/* Exam Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading exams...</div>
      ) : (
        <div className="exam-grid">
          {filteredExams.map((exam) => (
            <div className="exam-card" key={exam._id || exam.id}>
            <h2 className="exam-name">{exam.name}</h2>
            <div className="exam-details-list">
              <div className="detail-item">
                <span className="detail-icon">🎓</span>
                <div>
                  <strong>Eligibility</strong>
                  <p>{exam.eligibility}</p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📝</span>
                <div>
                  <strong>Exam Pattern</strong>
                  <p>{exam.pattern}</p>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📊</span>
                <div>
                  <strong>Vacancies (approx)</strong>
                  <p>{exam.vacancies}</p>
                </div>
              </div>
            </div>
            <button
              className="syllabus-button"
              onClick={() => handleSyllabusClick(exam.name)}
            >
              <span className="btn-icon">📘</span> View Syllabus & Details
            </button>
          </div>
        ))}
        </div>
      )}

      {/* No Results Fallback */}
      {filteredExams.length === 0 && (
        <div className="no-results">
          <span className="no-results-icon">📌</span>
          <p>No exams found. Try a different search term or browse all exams above.</p>
        </div>
      )}
    </div>
  );
};

export default Exams;
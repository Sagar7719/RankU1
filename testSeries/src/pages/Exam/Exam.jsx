import React, { useState } from 'react';
import './Exam.css';

const Exam = () => {
  const examsData = [
    {
      id: 1,
      name: 'UPSC Civil Services (IAS)',
      eligibility: "Bachelor's degree in any discipline",
      pattern: 'Prelims + Mains + Interview',
      vacancies: '~1,000',
      syllabusLink: '#',
    },
    {
      id: 2,
      name: 'SSC CGL',
      eligibility: "Bachelor's degree from recognized university",
      pattern: 'Tier I, II, III, IV',
      vacancies: '~4,000',
      syllabusLink: '#',
    },
    {
      id: 3,
      name: 'IBPS PO',
      eligibility: "Bachelor's degree (any discipline)",
      pattern: 'Prelims + Mains + Interview',
      vacancies: '~4,300',
      syllabusLink: '#',
    },
    {
      id: 4,
      name: 'RRB NTPC',
      eligibility: '12th Pass / Graduation (varies by post)',
      pattern: 'CBT 1 + CBT 2 + Skill Test',
      vacancies: '~35,000',
      syllabusLink: '#',
    },
    {
      id: 5,
      name: 'SBI PO',
      eligibility: "Bachelor's degree (any discipline)",
      pattern: 'Prelims + Mains + Group Exercise & Interview',
      vacancies: '~2,000',
      syllabusLink: '#',
    },
    {
      id: 6,
      name: 'RBI Grade B',
      eligibility: "Bachelor's degree with minimum 60% marks",
      pattern: 'Phase I + Phase II + Interview',
      vacancies: '~300',
      syllabusLink: '#',
    },
    {
      id: 7,
      name: 'CDS (Combined Defence Services)',
      eligibility: "Bachelor's degree (varies by academy)",
      pattern: 'Written Exam + SSB Interview',
      vacancies: '~400',
      syllabusLink: '#',
    },
    {
      id: 8,
      name: 'AFCAT',
      eligibility: "Bachelor's degree (minimum 60% marks)",
      pattern: 'Written Test + AFSB Interview',
      vacancies: '~250',
      syllabusLink: '#',
    },
    {
      id: 9,
      name: 'NABARD Grade A',
      eligibility: "Bachelor's degree with 50% marks",
      pattern: 'Prelims + Mains + Interview',
      vacancies: '~200',
      syllabusLink: '#',
    },
    {
      id: 10,
      name: 'Indian Railways (Various)',
      eligibility: '10th / 12th / Graduation (post dependent)',
      pattern: 'CBT + Skill Test / Document Verification',
      vacancies: '~1,20,000 (Multiple zones)',
      syllabusLink: '#',
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="exam-grid">
        {filteredExams.map((exam) => (
          <div className="exam-card" key={exam.id}>
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

export default Exam;
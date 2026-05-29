/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Exams.css';

const defaultCategories = [
  "All",
  "JEE",
  "NEET",
  "MHT CET",
  "SSC",
  "MPSC",
  "UPSC",
  "BANKING",
  "RAILWAY",
  "MH CET",
  "महाराष्ट्र पोलीस भरती",
  "Railways",
  "Defence",
  "State Exams",
  "Saral-Seva"
];

const Exams = () => {
  const location = useLocation();
  const [examsData, setExamsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  const dynamicCategories = [
    ...defaultCategories,
    ...new Set(
      examsData
        .map(e => e.category)
        .filter(cat => cat && !defaultCategories.some(c => c.toLowerCase() === cat.toLowerCase()))
    )
  ];

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/exams');
        if (response.ok) {
          const data = await response.json();
          setExamsData(data);

          // Set initial selected exam
          if (data.length > 0) {
            setSelectedExam(data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Handle category or search term set from location state (e.g. from Home page click)
  useEffect(() => {
    if (location.state && location.state.search) {
      const searchVal = location.state.search;

      // Check if searchVal matches a category (case-insensitive)
      const matchedCategory = dynamicCategories.find(cat => cat.toLowerCase() === searchVal.toLowerCase());
      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
        setSearchTerm('');
      } else {
        setSelectedCategory('All');
        setSearchTerm(searchVal);
      }
    }
  }, [location.state, examsData]);

  // Filter exams based on selected category and search term
  const filteredExams = examsData.filter((exam) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (exam.category && exam.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesSearch =
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.eligibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.pattern.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Automatically select the first exam in the filtered list if the current selection is filtered out
  useEffect(() => {
    if (filteredExams.length > 0) {
      const isStillInList = filteredExams.some(e => e._id === selectedExam?._id);
      if (!isStillInList) {
        setSelectedExam(filteredExams[0]);
      }
    } else {
      setSelectedExam(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm, examsData]);

  // Handle syllabus PDF view click
  const handleSyllabusClick = (exam) => {
    if (exam.syllabusLink && exam.syllabusLink !== '#') {
      const url = exam.syllabusLink.startsWith('http')
        ? exam.syllabusLink
        : `http://localhost:5000${exam.syllabusLink}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`📘 Syllabus for ${exam.name} will be available soon. Stay tuned for detailed PDF and topic-wise breakdown.`);
    }
  };

  return (
    <div className="exam-page-container">
      {/* HEADER HERO AREA */}
      <div className="exam-page-header">
        <h1 className="exam-page-title">Government <span className="gradient-highlight">Exam Directory</span></h1>
        <p className="exam-page-subtitle">
          Get comprehensive details about every major competitive exam in India, from eligibility and pattern to syllabus and vacancies.
        </p>
      </div>

      {loading ? (
        <div className="exam-page-loading">Loading Exam Directory...</div>
      ) : (
        <div className="exam-directory-layout">

          {/* COLUMN 1: CATEGORIES SIDEBAR */}
          <div className="categories-sidebar">
            <h3 className="sidebar-title">Categories</h3>
            <div className="categories-list">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  className={`category-item-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span>{cat}</span>
                  <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 2: EXAMS LIST */}
          <div className="exams-list-column">
            <div className="search-box-container">
              <input
                type="text"
                className="search-box-input"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="exams-scroll-list">
              {filteredExams.map((exam) => {
                const firstLetter = exam.name ? exam.name.charAt(0) : '?';
                const isSelected = selectedExam?._id === exam._id;

                return (
                  <div
                    key={exam._id}
                    className={`exam-list-item-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedExam(exam)}
                  >
                    <div className="exam-item-icon-circle">
                      {exam.image ? (
                        <img
                          src={exam.image.startsWith('http') ? exam.image : `http://localhost:5000${exam.image}`}
                          alt={exam.name}
                          className="exam-item-icon-img"
                        />
                      ) : (
                        <span>{firstLetter}</span>
                      )}
                    </div>
                    <div className="exam-item-info">
                      <h4 className="exam-item-title">{exam.name}</h4>
                      <span className="exam-item-badge">{exam.category || 'Active'}</span>
                    </div>
                  </div>
                );
              })}

              {filteredExams.length === 0 && (
                <div className="no-exams-found">
                  <span className="no-exams-icon">🔍</span>
                  <p>No exams found matching your filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: SELECTED EXAM DETAILS PANEL */}
          <div className="exam-details-column">
            {selectedExam ? (
              <div className="exam-details-card">
                <div className="exam-details-header">
                  <h2 className="exam-details-title">{selectedExam.name}</h2>
                  <div className="exam-details-tags">
                    <span className="detail-tag category">{selectedExam.category || 'Exam'}</span>
                    <span className="detail-tag status">Active</span>
                  </div>
                </div>

                <div className="details-scroll-content">
                  {/* OVERVIEW */}
                  <div className="details-section">
                    <div className="details-section-header">
                      <span className="section-icon">ℹ️</span>
                      <h3>Overview</h3>
                    </div>
                    <p className="details-section-text">
                      {selectedExam.overview || `${selectedExam.name} is a competitive government exam conducted for recruitment into various roles. Check eligibility criteria, paper patterns, and vacancies below.`}
                    </p>
                  </div>

                  {/* ELIGIBILITY */}
                  <div className="details-section">
                    <div className="details-section-header">
                      <span className="section-icon">🎓</span>
                      <h3>Eligibility</h3>
                    </div>
                    <p className="details-section-text">{selectedExam.eligibility}</p>
                  </div>

                  {/* EXAM PATTERN */}
                  <div className="details-section">
                    <div className="details-section-header">
                      <span className="section-icon">📝</span>
                      <h3>Exam Pattern</h3>
                    </div>
                    <p className="details-section-text">{selectedExam.pattern}</p>
                  </div>

                  {/* VACANCIES */}
                  <div className="details-section">
                    <div className="details-section-header">
                      <span className="section-icon">📊</span>
                      <h3>Vacancies</h3>
                    </div>
                    <p className="details-section-text">{selectedExam.vacancies}</p>
                  </div>
                </div>

                <div className="details-footer-action">
                  <button className="details-action-btn" onClick={() => handleSyllabusClick(selectedExam)}>
                    <span>📘 View Syllabus & Details</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="select-exam-prompt">
                <span className="prompt-icon">👈</span>
                <h3>Select an Exam</h3>
                <p>Choose an exam from the list on the left to see eligibility, pattern, and syllabus details.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Exams;
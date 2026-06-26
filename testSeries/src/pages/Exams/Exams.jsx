import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios';
import './Exams.css';

const defaultCategories = [
  'All',
  'SSC',
  'MPSC',
  'UPSC',
  'BANKING',
  'RAILWAY',
  'MH CET',
  'महाराष्ट्र पोलीस भरती',
  'Railways',
  'Defence',
  'State Exams',
  'Saral-Seva'
];

function Exams() {
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
        .map(function (e) {
          return e.category;
        })
        .filter(function (cat) {
          return cat && !defaultCategories.some(function (c) {
            return c.toLowerCase() === cat.toLowerCase();
          });
        })
    )
  ];

  useEffect(function () {
    const fetchExams = async function () {
      try {
        const response = await api.get('/exams');
        const data = response.data || [];
        setExamsData(data);

        if (data.length > 0) {
          setSelectedExam(data[0]);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  useEffect(function () {
    if (location.state && location.state.search) {
      const searchVal = location.state.search;
      const matchedCategory = dynamicCategories.find(function (cat) {
        return cat.toLowerCase() === searchVal.toLowerCase();
      });

      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
        setSearchTerm('');
      } else {
        setSelectedCategory('All');
        setSearchTerm(searchVal);
      }
    }
  }, [location.state, examsData]);

  const filteredExams = examsData.filter(function (exam) {
    const matchesCategory =
      selectedCategory === 'All' ||
      (exam.category && exam.category.toLowerCase() === selectedCategory.toLowerCase());

    const examName = exam.name || '';
    const examEligibility = exam.eligibility || '';
    const examPattern = exam.pattern || '';

    const matchesSearch =
      examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      examEligibility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      examPattern.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  useEffect(function () {
    if (filteredExams.length > 0) {
      const isStillInList = filteredExams.some(function (e) {
        return e._id === (selectedExam ? selectedExam._id : null);
      });
      if (!isStillInList) {
        setSelectedExam(filteredExams[0]);
      }
    } else {
      setSelectedExam(null);
    }
  }, [selectedCategory, searchTerm, examsData, filteredExams, selectedExam]);

  const handleSyllabusClick = function (exam) {
    if (exam.syllabusLink && exam.syllabusLink !== '#') {
      const url = exam.syllabusLink.startsWith('http')
        ? exam.syllabusLink
        : api.defaults.baseURL + exam.syllabusLink;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Syllabus for ' + exam.name + ' will be available soon. Stay tuned for detailed PDF and topic-wise breakdown.');
    }
  };

  return (
    <div className="exam-page-container">
      <div className="exam-page-header">
        <h1 className="exam-page-title">
          Government <span className="gradient-highlight">Exam Directory</span>
        </h1>
        <p className="exam-page-subtitle">
          Get comprehensive details about every major competitive exam in India, from eligibility and pattern to syllabus and vacancies.
        </p>
      </div>

      {loading ? (
        <div className="exam-page-loading">Loading Exam Directory...</div>
      ) : (
        <div className="exam-directory-layout">
          <div className="categories-sidebar">
            <h3 className="sidebar-title">Categories</h3>
            <div className="categories-list">
              {dynamicCategories.map(function (cat) {
                return (
                  <button
                    key={cat}
                    className={'category-item-btn ' + (selectedCategory === cat ? 'active' : '')}
                    onClick={function () {
                      setSelectedCategory(cat);
                    }}
                  >
                    <span>{cat}</span>
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="exams-list-column">
            <div className="search-box-container">
              <input
                type="text"
                className="search-box-input"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={function (e) {
                  setSearchTerm(e.target.value);
                }}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={function () {
                  setSearchTerm('');
                }}>
                  ✕
                </button>
              )}
            </div>

            <div className="exams-scroll-list">
              {filteredExams.map(function (exam) {
                const firstLetter = exam.name ? exam.name.charAt(0) : '?';
                const isSelected = selectedExam && selectedExam._id === exam._id;

                return (
                  <div
                    key={exam._id}
                    className={'exam-list-item-card ' + (isSelected ? 'selected' : '')}
                    onClick={function () {
                      setSelectedExam(exam);
                    }}
                  >
                    <div className="exam-item-icon-circle">
                      {exam.image ? (
                        <img
                          src={exam.image.startsWith('http') ? exam.image : api.defaults.baseURL + exam.image}
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
                  <div className="details-section">
                    <div className="details-section-header">
                      <span className="section-icon">ℹ️</span>
                      <h3>Overview</h3>
                    </div>
                    <p className="details-section-text">
                      {selectedExam.overview || (selectedExam.name + ' is a competitive government exam conducted for recruitment into various roles. Check eligibility criteria, paper patterns, and vacancies below.')}
                    </p>
                  </div>

                  <div className="details-section">
                    <div className="details-section-header">
                      <span className="section-icon">🎓</span>
                      <h3>Eligibility</h3>
                    </div>
                    <p className="details-section-text">{selectedExam.eligibility}</p>
                  </div>

                  <div className="details-section">
                    <div className="details-section-header">
                      <span className="section-icon">📝</span>
                      <h3>Exam Pattern</h3>
                    </div>
                    <p className="details-section-text">{selectedExam.pattern}</p>
                  </div>

                  <div className="details-section">
                    <div className="details-section-header">
                      <span className="section-icon">📊</span>
                      <h3>Vacancies</h3>
                    </div>
                    <p className="details-section-text">{selectedExam.vacancies}</p>
                  </div>
                </div>

                <div className="details-footer-action">
                  <button className="details-action-btn" onClick={function () {
                    handleSyllabusClick(selectedExam);
                  }}>
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
}

export default Exams;
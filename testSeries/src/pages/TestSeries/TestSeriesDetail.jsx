import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './TestSeriesDetail.css';

const TestSeriesDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('Mock Tests');
  const [test, setTest] = useState(null);
  const [categoryTests, setCategoryTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestAndCategoryList = async () => {
      try {
        const res = await api.get(`/tests/${id}`);
        setTest(res.data);
        
        // Fetch all other tests in the same category
        if (res.data && res.data.category) {
          const catRes = await api.get(`/tests?category=${encodeURIComponent(res.data.category)}`);
          setCategoryTests(catRes.data);
        }
      } catch (error) {
        console.error(error);
        // Fallback for UI if API fails
        const fallbackTest = {
          _id: id,
          title: 'पोलीस भरती टेस्ट -01',
          category: 'महाराष्ट्र पोलीस भरती',
          description: "RankU1's Mock Tests for महाराष्ट्र पोलीस भरती.",
          duration: '90 Mins',
          totalTests: 5,
          verified: true,
          difficulty: 'Medium',
          isFree: true
        };
        setTest(fallbackTest);
        setCategoryTests([fallbackTest]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestAndCategoryList();
  }, [id]);

  const tabs = [
    { name: 'Live Exams', type: 'Live', count: categoryTests.filter(t => t.testType === 'Live').length },
    { name: 'Mock Tests', type: 'Mock', count: categoryTests.filter(t => t.testType === 'Mock').length },
    { name: 'PYQs', type: 'PYQ', count: categoryTests.filter(t => t.testType === 'PYQ').length },
    { name: 'Sectional', type: 'Sectional', count: categoryTests.filter(t => t.testType === 'Sectional').length },
    { name: 'Topicwise', type: 'Topicwise', count: categoryTests.filter(t => t.testType === 'Topicwise').length },
  ];

  const handleStartTest = (targetId) => {
    if (!user) {
      alert("Please login to start the test.");
      navigate('/login');
      return;
    }
    navigate(`/interface-selection/${targetId}`);
  };

  if (loading) return <div style={{ color: 'var(--text-primary)', padding: '40px', textAlign: 'center' }}>Loading test details...</div>;
  if (!test) return <div style={{ color: 'var(--text-primary)', padding: '40px', textAlign: 'center' }}>Test not found.</div>;

  const activeTabType = tabs.find(t => t.name === activeTab)?.type || 'Mock';
  const filteredTests = categoryTests.filter(t => t.testType === activeTabType);

  return (
    <div className="testSeriesDetailContainer">
      <button className="backBtn" onClick={() => navigate(-1)}>
        &larr; Back to Test Series
      </button>

      <div className="detailBanner">
        <div className="bannerLeft">
          <div className="bannerIcon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="bannerText">
            <h1>{test.title}</h1>
            <p>{test.description || "Master your preparation with our exam-relevant mock tests."}</p>
          </div>
        </div>
        <div className="bannerRight">
          <div className="bannerStat">
            <span className="statHighlight">{categoryTests.length}</span>
            <span className="statLabel">TOTAL TESTS</span>
          </div>
          <div className="bannerStat">
            <span className="statHighlight">{categoryTests.filter(t => t.isFree).length}</span>
            <span className="statLabel">FREE MOCKS</span>
          </div>
        </div>
      </div>

      <div className="tabsContainer">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`tabBtn ${activeTab === tab.name ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      <div className="testList">
        {filteredTests.length > 0 ? (
          filteredTests.map((paper) => (
            <div className="testListItem" key={paper._id}>
              <div className="testIconCol">
                <div className={paper.isFree ? "testUnlockIcon free" : "testLockIcon paid"}>
                  {paper.isFree ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className="testContentCol">
                <div className="testItemHeader">
                  <h3>{paper.title}</h3>
                  <span className={paper.isFree ? "freeBadge" : "premiumBadge"}>
                    {paper.isFree ? "FREE" : "PREMIUM"}
                  </span>
                </div>
                <p className="testItemSubtitle">{paper.description || 'Practice test with exam-pattern questions.'}</p>
                <div className="testItemMeta">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    {paper.duration}
                  </span>
                  <span>•</span>
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                    {paper.difficulty || 'Medium'}
                  </span>
                  <span>•</span>
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    MCQ
                  </span>
                </div>
              </div>
              <div className="testActionCol">
                <button className="startTestBtn" onClick={() => handleStartTest(paper._id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Start
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="noTestsPlaceholder">
            <div className="placeholderIcon">📭</div>
            <h3>No Tests Found</h3>
            <p>We are currently preparing papers for this section. Check back shortly!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSeriesDetail;

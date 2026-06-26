import React, { useEffect, useState } from "react";
import "./TestSeries.css";
import CategoryFilter from "./components/CategoryFilter";
import TestCard from "./components/TestCard";
import { getTests } from "../../services/testService";

const TestSeries = () => {

  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // FETCH TESTS
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getTests();
        if (data && data.length > 0) {
          const grouped = {};
          data.forEach(t => {
            const examKey = t.exam || t.category;
            if (!examKey) return;

            if (!grouped[examKey]) {
              grouped[examKey] = {
                ...t, 
                category: examKey,
                title: t.seriesTitle || `${examKey} Exam Series`, 
                description: t.description || `Comprehensive mock tests, live exams, and practice papers for ${examKey}.`,
                totalTests: 1 
              };
            } else {
              grouped[examKey].totalTests += 1;
              if (!grouped[examKey].seriesTitle && t.seriesTitle) {
                grouped[examKey].seriesTitle = t.seriesTitle;
              }
              if ((!grouped[examKey].title || grouped[examKey].title === `${examKey} Exam Series`) && t.seriesTitle) {
                grouped[examKey].title = t.seriesTitle;
              }
            }
          });
          setTests(Object.values(grouped));
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  // DYNAMIC CATEGORIES
  const categories = [
    "All", "SSC", "MPSC", "UPSC", "BANKING", "RAILWAY", "MH CET", "महाराष्ट्र पोलीस भरती", "Railways", "Defence", "State Exams", "Saral-Seva", "Others"
  ];

  // FILTER LOGIC
  const filteredTests = tests.filter((test) => {
    return (
      test.title.toLowerCase().includes(search.toLowerCase()) &&
      (
        filter === "All" ||
        test.category.toLowerCase() === filter.toLowerCase()
      )
    );
  });

  return (
    <div className="testPageContainer">
      {/* HERO SECTION */}
      <div className="testSeriesHero">
        <div className="heroBadge">
          <span className="badgeSparkle">✨</span>
          <span>Premium Mock Tests</span>
        </div>
        <h1 className="heroTitle">
          Optimize Your Preparation with <br />
          <span className="highlightRankU1">RankU1</span> <span className="highlightTestSeries">Test Series</span>
        </h1>
        <p className="heroSub">
          Experience the most exam-relevant practice platform. Designed by toppers,<br />
          trusted by thousands of aspirants.
        </p>
        <div className="heroStats">
          <div className="statBox">
            <span className="statIcon">📈</span>
            <span className="statLabel"><strong>500+</strong> Mock Tests</span>
          </div>
          <div className="statBox">
            <span className="statIcon">🏅</span>
            <span className="statLabel"><strong>10k+</strong> Selected Candidates</span>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="topSectionWrapper">
        <div className="searchBox">
          <svg className="searchIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.9999 21L16.6499 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search for exam (e.g. SSC CGL 2024)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="searchInputBar"
          />
        </div>

        <CategoryFilter
          categories={categories}
          filter={filter}
          setFilter={setFilter}
        />
      </div>

      <div className="contentSection">
        {/* RESULT COUNT */}
        <p className="resultCountText">
          Found {filteredTests.length} Test Series
        </p>

        {/* CARDS */}
        {filteredTests.length > 0 ? (
          <div className="testCardGrid">
            {filteredTests.map((test) => (
              <TestCard
                key={test._id}
                test={test}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3>No Test Series Found</h3>
            <p>We couldn't find any test series matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSeries;
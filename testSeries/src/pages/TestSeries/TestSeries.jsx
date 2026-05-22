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
        // Fallback mockup data if empty to match screenshots
        if (!data || data.length === 0) {
          setTests([
            { _id: '1', title: 'महाराष्ट्र पोलीस भरती परीक्षा', description: "RankU1's Mock Test for महाराष्ट्र पोलीस भरती", category: 'महाराष्ट्र पोलीस भरती', totalTests: 5, duration: '7 Hr', verified: true },
            { _id: '2', title: 'Maharashtra Police Bharti Exam', description: "RankU1's Mock Test for महाराष्ट्र पोलीस भरती", category: 'महाराष्ट्र पोलीस भरती', totalTests: 2, duration: '3 Hr 30 Mins', verified: true },
            { _id: '3', title: 'MPSC COMBINE Grp-A', description: "RankU1's Mock Test for MPSC", category: 'MPSC', totalTests: 2, duration: '2 Hr 30 Mins', verified: true }
          ]);
        } else {
          setTests(data);
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
        <div className="testCardGrid">
          {filteredTests.map((test) => (
            <TestCard
              key={test._id}
              test={test}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestSeries;
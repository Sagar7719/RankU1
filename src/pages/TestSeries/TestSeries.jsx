import React, { useState } from "react";
import "./TestSeries.css";

const dummyTests = [
  {
    id: 1,
    title: "SSC CGL Mock Test 1",
    questions: 25,
    time: "30 min",
    category: "SSC",
  },
  {
    id: 2,
    title: "Banking Mock Test 1",
    questions: 20,
    time: "25 min",
    category: "Banking",
  },
  {
    id: 3,
    title: "Railway Mock Test",
    questions: 30,
    time: "40 min",
    category: "Railway",
  },
];

const TestSeries = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredTests = dummyTests.filter((test) => {
    return (
      test.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || test.category === filter)
    );
  });

  return (
    <div className="testSeries">
      <h1>Test Series</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search test..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="searchInput"
      />

      {/* FILTER */}
      <div className="filters">
        {["All", "SSC", "Banking", "Railway"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? "activeFilter" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="testGrid">
        {filteredTests.map((test) => (
          <div key={test.id} className="testCard">
            <h3>{test.title}</h3>
            <p>{test.questions} Questions</p>
            <p>{test.time}</p>

            <button className="startBtn">Start Test</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestSeries;
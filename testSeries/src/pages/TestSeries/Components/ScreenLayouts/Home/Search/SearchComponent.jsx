import React, { useState } from 'react';
import './SearchComponent.css';
import { Search } from 'lucide-react';


const SearchComponent = ({ onSearch, onExamCategorySelect, activeExamCategory }) => {
  const [searchTerm, setSearchTerm] = useState(''); 
  
  const examCategories = [
    'All', 'SSC', 'MPSC', 'UPSC', 'BANKING', 'RAILWAY', 'MH CET',
    'महाराष्ट्र पोलीस भरती', 'Railways', 'Defence', 'State Exams', 'Saral-Seva', 'Others'
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleCategoryClick = (category) => {
    onExamCategorySelect(category);
  };
  
  return (
    <div className="search-outer-container">
      <div className="search-container">
        <div className="search-wrapper">
          {/* Search Input Field */}
          <div className="search-input-group">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search for exam (e.g. SSC CGL 2024)..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Categories Section */}
          <div className="categories-wrapper">
            <div className="categories-container">
              {examCategories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${activeExamCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
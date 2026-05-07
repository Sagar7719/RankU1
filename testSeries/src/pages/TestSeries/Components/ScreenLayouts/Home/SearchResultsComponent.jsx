//searchresultscomponent
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchResults.css';
import { CheckCircle, Book, FileText, Clock, ChevronRight } from 'lucide-react';

const SearchResultsComponent = ({ 
  allSeries, 
  testsByCategory,
  searchTerm, 
  activeExamCategory
}) => {
  const navigate = useNavigate();

  // Format duration from minutes to readable string
  const formatDuration = (totalMinutes) => {
    if (!totalMinutes) return "90 Mins";
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours} Hr ${mins} Mins`;
    } else if (hours > 0) {
      return `${hours} Hr`;
    } else {
      return `${mins} Mins`;
    }
  };

  // Get series description based on test availability
  const getSeriesDescription = (series) => {
    if (series.testCount > 0) {
      return `RankU1's Mock Test for ${series.ExamCategory}`;
    } else {
      return 'Comprehensive mock test series for target exam.';
    }
  };

  // UPDATED: Navigate with state instead of URL param
  const handleCardClick = (series) => {
    navigate('/testseries/TestSeriesDetail', { 
      state: { series: series }  // Pass the entire series object
    });
  };

  const handleResetFilters = () => {
    window.location.reload();
  };
  
  // Filter series based on search term and category
  const filteredData = allSeries.filter((series) => {
    const matchesCategory = activeExamCategory === 'All' || series.ExamCategory === activeExamCategory;
    const matchesSearch = searchTerm === '' || 
      series.SeriesTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      series.ExamCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getDisplayMessage = () => {
    if (activeExamCategory !== 'All' && searchTerm) {
      return `Found ${filteredData.length} Test Series matching "${searchTerm}" in ${activeExamCategory}`;
    } else if (activeExamCategory !== 'All') {
      return `Found ${filteredData.length} Test Series in ${activeExamCategory}`;
    } else if (searchTerm) {
      return `Found ${filteredData.length} Test Series matching "${searchTerm}"`;
    } else {
      return `Found ${filteredData.length} Test Series`;
    }
  };
  
  if (filteredData.length === 0) {
    return (
      <div className="ts-results-container">
        <div className="ts-results-info">
          <h5>{getDisplayMessage()}</h5>
        </div>
        <div className="ts-empty">
          <div className="ts-empty-icon">
            <Book size={48} />
          </div>
          <h3>No results found</h3>
          <p>Try adjusting your search or category filter to find what you're looking for.</p>
          <button className="ts-reset-btn" onClick={handleResetFilters}>
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ts-results-container">
      <div className="ts-results-info">
        <h5>{getDisplayMessage()}</h5>
      </div>
      
      <div className="ts-grid">
        {filteredData.map((series, index) => {
          const description = getSeriesDescription(series);
          const defaultDuration = series.totalDuration || 90;
          
          return (
            <div 
              key={index} 
              className="ts-premium-card"
              onClick={() => handleCardClick(series)}  // Pass the entire series object
            >
              <div className="ts-card-header">
                <span className="ts-card-category">{series.ExamCategory}</span>
                
                {series.verified && (
                  <div className="ts-card-badge">
                    <CheckCircle />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <div className="ts-card-body">
                <h3>{series.SeriesTitle}</h3>
                <p>{description}</p>
              </div>

              <div className="ts-card-footer">
                <div className="ts-card-meta">
                  <div className="ts-meta-item">
                    <FileText size={16} />
                    <span>{series.testCount} {series.testCount === 1 ? 'Test' : 'Tests'}</span>
                  </div>
                  
                  <div className="ts-meta-item">
                    <Clock size={16} />
                    <span>{formatDuration(defaultDuration)}</span>
                  </div>
                </div>

                <button 
                  className="ts-card-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(series);  // Pass the entire series object
                  }}
                >
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResultsComponent;
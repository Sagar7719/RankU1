import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "./CurrentAffairs.css";
import { Link } from "react-router-dom";
import newsImagePlaceholder from "../../assets/images/news.jpg";
import { FaBolt, FaAward, FaArrowUp, FaCalendarAlt, FaSpinner } from "react-icons/fa";

const CurrentAffairs = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get("/news");
        setNewsList(res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).toUpperCase();
  };

  return (
    <section className="middle-section">
      {/* Pre Heading */}
      <button className="pre-heading-btn">
        <FaBolt /> Premium Daily Dose
      </button>

      {/* Main Heading */}
      <h2 className="main-heading">
        Stay Informed With
        <span className="highlight-text"> Daily Dose & News</span>
      </h2>

      {/* Description */}
      <p className="heading-description">
        Experience the most exam-relevant news platform. Curated by experts, trusted
        by thousands of aspirants.
      </p>

      <div className="stats-buttons">
        <button className="stats-btn">
          <FaArrowUp /> 500+ Daily Articles
        </button>
        <button className="stats-btn">
          <FaAward /> 10k+ Selected Candidates
        </button>
      </div>

      {loading ? (
        <div className="loading-container" style={{ padding: '3rem', color: 'var(--accent-primary)' }}>
          <FaSpinner className="spin-icon" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Fetching latest news...</p>
        </div>
      ) : newsList.length > 0 ? (
        <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem', width: '100%', marginTop: '3rem' }}>
          {newsList.map((news) => (
            <Link key={news._id} to={`/news-page/${news._id}`} className="news-card-link">
              <div className="news-card">
                <div className="image-wrapper">
                  <button className="category-btn">{news.category}</button>
                  <img src={news.image || newsImagePlaceholder} alt={news.title} className="news-image" />
                </div>
                <div className="news-content">
                  <p className="news-date">
                    <FaCalendarAlt /> {formatDate(news.date)}
                  </p>
                  <h3 className="news-heading">{news.title}</h3>
                  <p className="news-description">
                    {news.description.substring(0, 150)}...
                  </p>
                  <span className="read-more-btn">
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
          <p>No news articles available at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default CurrentAffairs;
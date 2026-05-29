import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../api/axios";
import "./NewsPage.css";
import { FaCalendar, FaArrowLeft, FaSpinner } from "react-icons/fa";
import newsImagePlaceholder from "../../../assets/Images/news.jpg";

const NewsPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const res = await api.get(`/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error("Error fetching news details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="news-loading" style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--accent-primary)' }}>
        <FaSpinner style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem' }}>Loading article...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-error" style={{ padding: '5rem', textAlign: 'center' }}>
        <h2>Article not found</h2>
        <Link to="/current-affairs" className="back-btn" style={{ marginTop: '2rem', display: 'inline-block' }}>
          <FaArrowLeft /> Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="news-page">
      <Link to="/current-affairs" className="back-link">
        <button className="back-btn">
          <FaArrowLeft /> Back to List
        </button>
      </Link>
      
      <div className="news-image-container">
        <img src={news.image || newsImagePlaceholder} alt={news.title} className="news-page-image" onError={(e) => { e.target.onerror = null; e.target.src = newsImagePlaceholder; }} />
        <button className="general-btn">{news.category}</button>
      </div>
        
      <p className="news-date">
        <FaCalendar /> {new Date(news.date).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <h1 className="news-title">{news.title}</h1>

      <div className="news-content-full">
        {news.fullContent.split('\n').map((paragraph, index) => (
          paragraph.trim() && <p key={index} className="news-text">{paragraph}</p>
        ))}
      </div>
      
      <div className="author-info" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Published by: <strong>{news.author}</strong>
      </div>
    </div>
  );
};

export default NewsPage;
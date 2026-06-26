// Updates.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import './Updates.css';

const sampleNotifications = [
  {
    id: 1,
    date: '18 Feb',
    title: 'SSC CGL 2024 Tier-I Exam Dates Announced',
    description: 'Stay updated with the latest changes in SSC CGL 2024',
    category: 'exams',
    link: '#',
  },
  {
    id: 2,
    date: '18 Feb',
    title: 'RRB NTPC CEN 01/2024 Official Notification Out',
    description: 'Stay updated with latest RRB NTPC notification.',
    category: 'exams',
    link: '#',
  },
  {
    id: 3,
    date: '03 Feb',
    title: 'UPSC Civil Services Bharti 2026',
    description: 'Stay updated with latest UPSC notification.',
    category: 'exams',
    link: '#',
  },
  {
    id: 4,
    date: '25 May',
    title: 'MPSC Rajyaseva 2026 Hall Ticket Released',
    description: 'Download the admit card for State Services Pre-Exam now.',
    category: 'admit-cards',
    link: '#',
  },
  {
    id: 5,
    date: '24 May',
    title: 'IBPS PO 2025 Phase-II Admit Card Out',
    description: 'Main examination call letters are available for download.',
    category: 'admit-cards',
    link: '#',
  },
  {
    id: 6,
    date: '20 May',
    title: 'Maharashtra Talathi Result 2025 Declared',
    description: 'Check district-wise selected candidate lists and final cut-offs.',
    category: 'results',
    link: '#',
  },
  {
    id: 7,
    date: '15 May',
    title: 'Police Bharti 2025 Physical Test Merit List',
    description: 'Selected candidates for the physical standard tests list published.',
    category: 'results',
    link: '#',
  },
];

const Updates = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/news');
        if (res.data && res.data.length > 0) {
          const formatted = res.data.map(item => {
            const dateObj = new Date(item.date || item.createdAt || Date.now());
            const day = dateObj.getDate() || 1;
            const month = dateObj.toLocaleString('en-US', { month: 'short' }) || 'Jan';
            
            // Map backend category to frontend tab category
            let cat = 'exams';
            const itemCat = (item.category || '').toLowerCase();
            if (itemCat.includes('result')) {
              cat = 'results';
            } else if (itemCat.includes('admit') || itemCat.includes('ticket') || itemCat.includes('hall')) {
              cat = 'admit-cards';
            } else if (itemCat.includes('exam') || itemCat.includes('bharti') || ['ssc', 'mpsc', 'upsc', 'railway', 'banking'].some(k => itemCat.includes(k))) {
              cat = 'exams';
            } else {
              cat = 'all'; // General news falls under Latest
            }

            return {
              id: item._id,
              date: `${day} ${month}`,
              title: item.title,
              description: item.description,
              category: cat,
              link: `/news-page/${item._id}`
            };
          });
          setNotifications(formatted);
        } else {
          setNotifications(sampleNotifications);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications(sampleNotifications);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Filter notifications based on selected tab category
  const filteredNotifications = notifications.filter((notif) => {
    if (activeCategory === 'all') return true;
    return notif.category === activeCategory;
  });

  return (
    <div className="updates-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="notification-badge">
            <span className="badge-icon">🔔</span>
            <span>REAL-TIME NOTIFICATIONS</span>
          </div>
          <h1 className="hero-title">
            Stay Ahead of the <span className="gradient-text">Curve</span>
          </h1>
          <p className="hero-description">
            Get instant updates on the latest government notifications, application windows,
            admit cards, and results.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button 
          className={`tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          Latest Updates
        </button>
        <button 
          className={`tab-btn ${activeCategory === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveCategory('exams')}
        >
          Live Exams
        </button>
        <button 
          className={`tab-btn ${activeCategory === 'admit-cards' ? 'active' : ''}`}
          onClick={() => setActiveCategory('admit-cards')}
        >
          Admit Cards
        </button>
        <button 
          className={`tab-btn ${activeCategory === 'results' ? 'active' : ''}`}
          onClick={() => setActiveCategory('results')}
        >
          Results
        </button>
      </div>

      {/* Notifications Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: '600' }}>
          Loading latest updates...
        </div>
      ) : (
        <div className="notifications-grid">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className="notification-card">
              <div className="card-date">
                <span className="date-day">{notification.date.split(' ')[0]}</span>
                <span className="date-month">{notification.date.split(' ')[1]}</span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{notification.title}</h3>
                <p className="card-description">{notification.description}</p>
                {notification.link.startsWith('/') ? (
                  <Link to={notification.link} className="read-more">
                    Read Full Details →
                  </Link>
                ) : (
                  <a href={notification.link} className="read-more">
                    Read Full Details →
                  </a>
                )}
              </div>
            </div>
          ))}
          {filteredNotifications.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No updates available in this category.
            </div>
          )}
        </div>
      )}

      {/* Call to Action Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Don't Just Stay Updated, Get Prepared.</h2>
          <Link to="/test-series" className="cta-button" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Start Mock Test
            <span className="button-icon">⚡</span>
          </Link>
          <p className="cta-description">
            Practice with our industry-level mock tests designed by experts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Updates;